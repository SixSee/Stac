import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import {ethers} from "ethers";
import SupplyChain from "../../../artifacts/contracts/AmazonDelivery.sol/AmazonDelivery.json";
import {useState} from "react";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ItemCard({ item }) {

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


    const placeOrder = async (_orderId, _productId, _productName, _productPrice, _stacId, _accelerometerX, _accelerometerY, _accelerometerZ, _timeBackend) => {

        console.log("hsodn");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        try{
            const placeOrderDetails = await contract.placeOrder(_orderId, _productId, _productName,  ethers.utils.parseEther(_productPrice), _stacId, _accelerometerX, _accelerometerY, _accelerometerZ, _timeBackend, {gasLimit: 3000000, value: ethers.utils.parseEther(_productPrice)} );
            placeOrderDetails.wait();
            console.log(placeOrderDetails);
            setSuccessSnackbarMessage("Order Placed")
            handleClickSuccess();
        }
        catch (err){
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

    const buyOrder = async (id, name, price) => {

        console.log(id, name, price);
        console.log(JSON.stringify({itemId: id}));
        const createOrder = await fetch(`${process.env.REACT_APP_BASE_URL}/order`, {
            'method': "POST",
            headers: {
                "x-access-token": localStorage.getItem("authtoken"),
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({itemId: id})
        }).then(res => res.json())
        console.log(createOrder.stacId);
        // const placeOrderDetails = await contract.placeOrder(1, "Coffee", ethers.utils.parseEther("0.01"), "ke474rf", 1, 2, 3, 1234, {gasLimit: 3000000, value: ethers.utils.parseEther("0.01")} );

        await placeOrder(createOrder.orderId, id, name, price.toString(), createOrder.stacId, 1, 2, 3, createOrder.timestamp);
        console.log("asd")
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={`${item.image_link}`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
                    <span style={{ color: "black" }}>{item.name}</span>
                    <span style={{ color: "black", display: "flex", justifyContent: "space-between", alignContent: "center" }} ><ProductionQuantityLimitsIcon style={{ color: "grey" }} /> {item.quantity}</span>
                    <span style={{ color: "black", display: "flex", justifyContent: "space-between", alignContent: "center" }} ><CurrencyRupeeIcon style={{ color: "grey" }} /> {item.price}</span>

                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" onClick={()=> buyOrder(item._id, item.name, item.price)}>Buy Now</Button>
                {/* <Button size="small">Learn More</Button> */}
            </CardActions>
        </Card >
    );
}