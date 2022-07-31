import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import SupplyChain from "../../artifacts/contracts/AmazonDelivery.sol/AmazonDelivery.json";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function HomePage() {

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


    const [orderHistory, setOrderHistory] = useState([{
        "oid": 0,
        "orderDetails": {
            "oid": 0,
            "boxHash": "",
            "productId": 0,
            "orderProductName": "",
            "orderValue": -1,
            "customerAddress": ""
        },
        "physicalReadings": {
            "accelerometerX": 0,
            "accelerometerY": 0,
            "accelerometerZ": 0
        },
        "transferredOnBackend": -1,
        "transactionTime": -1,
        "validQuality": true,
        "currentOwner": "",
        "refundStatus": true,
        "ownerType": -1
    }]);

    const placeOrder = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        try {
            const placeOrderDetails = await contract.placeOrder(1, "Coffee", ethers.utils.parseEther("0.01"), "ke474rf", 1, 2, 3, 1234, { gasLimit: 3000000, value: ethers.utils.parseEther("0.01") });
            placeOrderDetails.wait();
            console.log(placeOrderDetails);
            setSuccessSnackbarMessage("Order Placed")
            handleClickSuccess();
        }
        catch (err) {
            setErrorSnackbarMessage(err.message);
            handleClickError();
        }

    }

    const getOrderDetails = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);
        // const contract = new ethers.Contract(contractAddress, SupplyChain.abi, provider);

        try {
            const orderHistoryDetails = await contract.getOrderStatus(1);
            const setValOrderHistory = () => {
                let returnVal = [];
                for (let i = 0; i < orderHistoryDetails.length; i++) {
                    const itrValue = {
                        oid: orderHistoryDetails[i].oid.toNumber(),
                        orderDetails: {
                            oid: orderHistoryDetails[i].orderDetails.oid.toNumber(),
                            boxHash: orderHistoryDetails[i].orderDetails.boxHash,
                            productId: orderHistoryDetails[i].orderDetails.productId.toNumber(),
                            orderProductName: orderHistoryDetails[i].orderDetails.orderProductName,
                            orderValue: orderHistoryDetails[i].orderDetails.orderValue.toNumber(),
                            customerAddress: orderHistoryDetails[i].orderDetails.customerAddress
                        },
                        physicalReadings: {
                            accelerometerX: orderHistoryDetails[i].physicalReadings.accelerometerX.toNumber(),
                            accelerometerY: orderHistoryDetails[i].physicalReadings.accelerometerY.toNumber(),
                            accelerometerZ: orderHistoryDetails[i].physicalReadings.accelerometerZ.toNumber(),
                        },
                        transferredOnBackend: orderHistoryDetails[i].transferredOnBackend,
                        transactionTime: orderHistoryDetails[i].transactionTime.toNumber(),
                        validQuality: orderHistoryDetails[i].validQuality,
                        currentOwner: orderHistoryDetails[i].currentOwner,
                        refundStatus: orderHistoryDetails[i].refundStatus,
                        ownerType: orderHistoryDetails[i].ownerType
                    }
                    returnVal.push(itrValue);
                }
                return returnVal;
            }
            setOrderHistory(setValOrderHistory);
        }
        catch (err) {
            setErrorSnackbarMessage(err.message);
            handleClickError();
        }
    }

    const transferOrderDetails = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        try {
            const orderTransferDetails = await contract.transferOrder(1, "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", 2, 2, 4, { gasLimit: 3000000 });
            orderTransferDetails.wait();
            console.log(orderTransferDetails);
            setSuccessSnackbarMessage("Order transferred successfully");
            handleClickSuccess();
        } catch (err) {
            if (err.message.search("Current owner nor carrying out transaction") !== -1)
                setErrorSnackbarMessage("Access Denied: Current owner nor carrying out transaction");
            else if (err.message.search("function selector was not recognized and there's no fallback function") !== -1)
                setErrorSnackbarMessage("Order Doesn't exist");
            else
                setErrorSnackbarMessage(err.message);
            handleClickError();
        }
    }

    const refundTransaction = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        try {
            const approveRefund = await contract.approveRefund(1, { gasLimit: 3000000 });
            approveRefund.wait();
            console.log(approveRefund);
            setSuccessSnackbarMessage("Order transferred successfully");
            handleClickSuccess();
        } catch (err) {
            if (err.message.search("Access to refund Denied") !== -1)
                setErrorSnackbarMessage("Access Denied: Only seller can carry out transaction");
            else if (err.mAlertessage.search("function selector was not recognized and there's no fallback function") !== -1)
                setErrorSnackbarMessage("Order Doesn't exist");
            else
                setErrorSnackbarMessage(err.message);
            handleClickError();
        }
    }





    const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
    const [successSnackbarMessage, setSuccessSnackbarMessage] = useState("");
    const handleClickSuccess = () => {
        setOpenSuccessSnackbar(true);
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessSnackbar(false);
    };


    const successSnackbar = () => {
        return (
            <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>
        )
    }
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");

    const handleClickError = () => {
        setOpenErrorSnackbar(true);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenErrorSnackbar(false);
    };


    const errorSnackbar = () => {
        return (
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {errorSnackbarMessage}
                </Alert>
            </Snackbar>
        )
    }

    const [contractBalance, setContractBalance] = useState("");

    const fetchContractBalance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        const contractBalance = await contract.provider.getBalance(contract.address)
        console.log(ethers.utils.formatEther(contractBalance));
        setContractBalance(ethers.utils.formatEther(contractBalance));

    }

    const [customerBalance, setCustomerBalance] = useState("");

    const fetchCustomerBalance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        const customerBalanceVal = await provider.getBalance("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
        console.log(ethers.utils.formatEther(customerBalanceVal));
        setCustomerBalance(ethers.utils.formatEther(customerBalanceVal));

    }

    return (
        <div className='wrapper'>
            <button className="placeOrder" onClick={placeOrder}>
                placeOrder
            </button>
            <button className="getOrderDetails" onClick={getOrderDetails}>
                get order details
            </button>
            <button className="openSnackbar" onClick={handleClickSuccess}>
                success sb
            </button>
            <button className="openErrorSnackbar" onClick={handleClickError}>
                error sb
            </button>
            <button className="transferOrder" onClick={transferOrderDetails}>
                Transfer Order
            </button>
            <button className="refundAmount" onClick={refundTransaction}>
                Refund Transaction
            </button>
            <div className="customerBalance" onClick={fetchCustomerBalance}>
                Fetch Customer Balance: {customerBalance}
            </div>
            <div className="customerBalance" onClick={fetchContractBalance}>
                Fetch Contract Balance: {contractBalance}
            </div>
            {successSnackbar()}
            {errorSnackbar()}
        </div>
    );
}

export default HomePage;