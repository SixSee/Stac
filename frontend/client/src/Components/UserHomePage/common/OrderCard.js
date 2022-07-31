import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {useState} from "react";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import {ethers} from "ethers";
import SupplyChain from "../../../artifacts/contracts/AmazonDelivery.sol/AmazonDelivery.json";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function OrderCard({ item }) {

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const [open, setOpen] = React.useState(false);
    const handleOpen =  () => {
         setOpen(true);
    }
    const handleClose = () => setOpen(false);
    // const [orderHistory, setOrderHistory] = useState([{
    //     "oid": 0,
    //     "orderDetails": {
    //         "oid": 0,
    //         "boxHash": "",
    //         "productId": 0,
    //         "orderProductName": "",
    //         "orderValue": -1,
    //         "customerAddress": ""
    //     },
    //     "physicalReadings": {
    //         "accelerometerX": 0,
    //         "accelerometerY": 0,
    //         "accelerometerZ": 0
    //     },
    //     "transferredOnBackend": -1,
    //     "transactionTime": -1,
    //     "validQuality": true,
    //     "currentOwner": "",
    //     "refundStatus": true,
    //     "ownerType": -1
    // }]);
    // const getOrderDetails = async () => {
    //     // const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    //     const signer = provider.getSigner();
    //     // const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);
    //     const contract = new ethers.Contract(contractAddress, SupplyChain.abi, provider);

    //     try {
    //         const orderHistoryDetails = await contract.getOrderStatus(item.orderId);
    //         const setValOrderHistory = () => {
    //             let returnVal = [];
    //             for (let i = 0; i < orderHistoryDetails.length; i++) {
    //                 const itrValue = {
    //                     oid: orderHistoryDetails[i].oid.toNumber(),
    //                     orderDetails: {
    //                         oid: orderHistoryDetails[i].orderDetails.oid.toNumber(),
    //                         boxHash: orderHistoryDetails[i].orderDetails.boxHash,
    //                         productId: orderHistoryDetails[i].orderDetails.productId.toNumber(),
    //                         orderProductName: orderHistoryDetails[i].orderDetails.orderProductName,
    //                         orderValue: orderHistoryDetails[i].orderDetails.orderValue.toNumber(),
    //                         customerAddress: orderHistoryDetails[i].orderDetails.customerAddress
    //                     },
    //                     physicalReadings: {
    //                         accelerometerX: orderHistoryDetails[i].physicalReadings.accelerometerX.toNumber(),
    //                         accelerometerY: orderHistoryDetails[i].physicalReadings.accelerometerY.toNumber(),
    //                         accelerometerZ: orderHistoryDetails[i].physicalReadings.accelerometerZ.toNumber(),
    //                     },
    //                     transferredOnBackend: orderHistoryDetails[i].transferredOnBackend,
    //                     transactionTime: orderHistoryDetails[i].transactionTime.toNumber(),
    //                     validQuality: orderHistoryDetails[i].validQuality,
    //                     currentOwner: orderHistoryDetails[i].currentOwner,
    //                     refundStatus: orderHistoryDetails[i].refundStatus,
    //                     ownerType: orderHistoryDetails[i].ownerType
    //                 }
    //                 returnVal.push(itrValue);
    //             }
    //             return returnVal;
    //         }
    //         setOrderHistory(setValOrderHistory);
    //     }

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
    console.log(orderHistory);


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
        return(
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
        return(
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {errorSnackbarMessage}
                </Alert>
            </Snackbar>
        )
    }

    const getOrderDetails= async(id) =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);
        // const contract = new ethers.Contract(contractAddress, SupplyChain.abi, provider);

        try {
            console.log(id)
            const orderHistoryDetails = await contract.getOrderStatus(id);
            console.log(orderHistoryDetails);
            let returnVal = [];
            // const setValOrderHistory = () => {
                for (let i = 0; i < orderHistoryDetails.length; i++) {
                    const itrValue = {
                        oid: orderHistoryDetails[i].oid,
                        orderDetails: {
                            oid: orderHistoryDetails[i].orderDetails.oid,
                            boxHash: orderHistoryDetails[i].orderDetails.boxHash,
                            productId: orderHistoryDetails[i].orderDetails.productId,
                            orderProductName: orderHistoryDetails[i].orderDetails.orderProductName,
                            orderValue: ethers.utils.formatEther(orderHistoryDetails[i].orderDetails.orderValue),
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
                    console.log(itrValue);
                    returnVal.push(itrValue);
                }
            // }
            //     setValOrderHistory();
            //     console.log(setValOrderHistory);
                setOrderHistory(returnVal);
                handleOpen();
            }

        catch (err){
            setErrorSnackbarMessage(err.message);
            handleClickError();
        }
    }

    const style = {
        color:"black",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: "60%",
        bgcolor: 'background.paper',
        border: '1px solid grey',
        boxShadow: 24,
        p: 4,
        borderRadius: "12px"
    };

    return (
        <Card sx={{ maxWidth: 345 }}>

            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={`${process.env.REACT_APP_BASE_URL}` + `${item.itemId.image_link}`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
                    <span style={{ color: "black" }}>{item.itemId.name}</span>
                    {/* <span style={{ color: "black", display: "flex", justifyContent: "space-between", alignContent: "center" }} ><ProductionQuantityLimitsIcon style={{ color: "grey" }} /> {item.quantity}</span> */}
                    <span style={{ color: "black", display: "flex", justifyContent: "space-between", alignContent: "center" }} ><CurrencyRupeeIcon style={{ color: "grey" }} /> {item.itemId.price}</span>

                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.itemId.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" onClick={()=> getOrderDetails(item._id)} size="small">View Details</Button>
                {/* <Button size="small">Learn More</Button> */}
            </CardActions>
            <Modal
                disableAutoFocus
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {
                            orderHistory.map((item, index)=>{
                                return(
                                    <>
                                        <div><h3>{index + 1}</h3></div>
                                          <div>OrderID: {item.oid}</div>
                                          <div>CustomerAddress: {item.orderDetails.customerAddress}</div>
                                          <div>Box Hash: {item.orderDetails.boxHash}</div>
                                          <div>Product ID: {item.orderDetails.productId}</div>
                                          <div>Product Name: {item.orderDetails.orderProductName}</div>
                                          <div>Current Owner: {item.currentOwner}</div>
                                          <div>Transferred On: {item.transferredOnBackend}</div>
                                        <br />
                                        <br/>
                                      </>
                                )
                            })
                        }

                    </Box>
                </Fade>
            </Modal>
            {successSnackbar()}
            {errorSnackbar()}
        </Card >
    );
}