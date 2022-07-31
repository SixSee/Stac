pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract AmazonDelivery{
    address payable contractOwner;

    //OwnerType enum
    enum OwnerType{
        Factory,
        Delivery,
        Customer
    }

    // Physical Readings struct
    struct PhysicalReadings{
        uint accelerometerX;  //accelerometerPitch
        uint accelerometerY;  //accelerometerRoll
        uint accelerometerZ;  //accelerometerAzimuth
    }

    // Struct to store product history
    struct ProductHistory{
        string oid;
        OrderDetails orderDetails;
        PhysicalReadings physicalReadings;
        string transferredOnBackend;
        uint transactionTime;
        bool validQuality;
        address payable currentOwner;
        bool refundStatus;
        OwnerType ownerType;
    }

    // Order Details struct
    struct OrderDetails{
        string oid;
        string boxHash;
        string productId;
        string orderProductName;
        uint orderValue;
        address customerAddress;
    }

    mapping(string  => ProductHistory[]) public history;

    event transferOwnership(string _orderID, address payable _transferredTo);
    event PlacedOrder(string _orderID, string _productID, address _customerAddress, uint _orderValue);

    constructor() public {
        contractOwner = payable(msg.sender);
    }

    function placeOrder(string memory _orderID, string memory _productID, string memory _productName, uint _orderValue, string memory _boxHash, uint _accelerometerX, uint _accelerometerY, uint _accelerometerZ, string memory _transferredOnBackend) public payable{
        require(msg.value == _orderValue, "Amount Paid is not correct");
        emit PlacedOrder(_orderID, _productID, msg.sender, _orderValue);
        ProductHistory memory _productHistory;
        PhysicalReadings memory _physicalReadings = getPhysicalReadings(_accelerometerX, _accelerometerY, _accelerometerZ);
        OrderDetails memory _orderDetails = getOrderDetails(_orderID, _productID, _productName, _orderValue, msg.sender, _boxHash);
        _productHistory.physicalReadings = _physicalReadings;
        _productHistory.orderDetails = _orderDetails;
        _productHistory.oid = _orderID;
        _productHistory = insertFirstEntry(_productHistory, _transferredOnBackend);
        history[_orderID].push(_productHistory);
    }

    function getOrderDetails(string memory _orderID, string memory _productID, string memory _productName, uint _orderValue, address _customerAddress, string memory _boxHash) internal view returns( OrderDetails memory){

        OrderDetails memory _orderDetails = OrderDetails({
            oid: _orderID,
            customerAddress: _customerAddress,
            productId: _productID,
            orderProductName: _productName,
            orderValue : _orderValue,
            boxHash: _boxHash
        });
        return _orderDetails;
    }

    function getPhysicalReadings(uint _accelerometerX, uint _accelerometerY, uint _accelerometerZ) public view returns(PhysicalReadings memory){
        PhysicalReadings memory _physicalReadings = PhysicalReadings({
            accelerometerX: _accelerometerX,
            accelerometerY: _accelerometerY,
            accelerometerZ: _accelerometerZ
        });
        return _physicalReadings;
    }

    function insertFirstEntry(ProductHistory memory _productHistory, string memory _transferredOnBackend) internal returns(ProductHistory memory){
        _productHistory.transferredOnBackend= _transferredOnBackend;
        _productHistory.transactionTime= block.timestamp;
        _productHistory.currentOwner= payable(contractOwner);
        _productHistory.refundStatus= false;
        _productHistory.ownerType = OwnerType.Factory;
        return _productHistory;
    }

    function transferOrder(string memory _orderID, address payable _transferredTo, uint _accelerometerX, uint _accelerometerY, uint _accelerometerZ, string memory _transferredOnBackend) public {
        ProductHistory memory _product = history[_orderID][history[_orderID].length-1];
        require(_product.currentOwner == payable(msg.sender), "Current owner nor carrying out transaction");
        emit transferOwnership(_orderID, _transferredTo);
        _product.currentOwner = _transferredTo;
        _product.transferredOnBackend = _transferredOnBackend;
        _product.transactionTime= block.timestamp;
        (_transferredTo == _product.orderDetails.customerAddress) ? _product.ownerType = OwnerType.Customer : _product.ownerType = OwnerType.Delivery;
        history[_orderID].push(_product);
        emit transferOwnership(_orderID, _transferredTo);
    }

    //get order status
    function getOrderStatus(string memory _orderID) public view returns(ProductHistory[] memory){
        return history[_orderID];
    }


    // Only final Customer can view and match the box hash
    function getBoxDetails(string memory _orderID) public view returns(string memory){
        require(msg.sender == history[_orderID][0].orderDetails.customerAddress, "Not the final customer");
        return history[_orderID][0].orderDetails.boxHash;
    }


    function approveRefund(string memory _orderID) public {
        require(msg.sender==contractOwner, "Access to refund denied");
        ProductHistory memory productHistory;
        productHistory= history[_orderID][history[_orderID].length-1];
        productHistory.refundStatus= true;
        refundAmount(_orderID, productHistory.orderDetails.orderValue);
        history[_orderID].push(productHistory);
    }


//    Refund amount to the customer for returned
    function refundAmount(string memory _orderID, uint amount) internal {
        require(msg.sender==contractOwner, "Access to refund denied");
        history[_orderID][history[_orderID].length-1].currentOwner.transfer(history[_orderID][0].orderDetails.orderValue);
    }
}
