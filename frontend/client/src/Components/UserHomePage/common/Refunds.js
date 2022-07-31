import {getListItemSecondaryActionClassesUtilityClass, Snackbar} from '@mui/material';
import React, { useEffect, useState } from 'react'
import ItemCard from './ItemCard';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import OrderCard from './OrderCard';
import { ethers } from 'ethers';
import RefundCard from './RefundCard'
import SupplyChain from "../../../artifacts/contracts/AmazonDelivery.sol/AmazonDelivery.json";
import MuiAlert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Refunds({ person }) {

    const [refundAddress, setRefundAddress] = useState("");
    const [orderIDValue, setOrderIDValue] = useState("");
    const [refundOrderID, setRefundOrderID] = useState("");

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const [items, setItems] = useState(undefined);

    async function getItems() {
        return await fetch(`${process.env.REACT_APP_BASE_URL}/order/` + person + `_refunded`, {
            'method': "GET",
            headers: {
                "x-access-token": localStorage.getItem("authtoken"),
            }
        }).then(res => res.json())
    }
    async function fetchItems() {
        setItems(await getItems());
    }

    const refundTransaction = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        try {
            const approveRefund = await contract.approveRefund(refundOrderID, { gasLimit: 3000000 });
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

        const transferOrderDetails = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);

        try {
            const orderTransferDetails = await contract.transferOrder(orderIDValue, refundAddress, 76, 27, 441, { gasLimit: 3000000 });
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



    useEffect(() => {
        fetchItems();
    }, [])
    console.log(items);
    return (
        <div>
        <div id="market-div">
            <TextField id="outlined-basic" label="Refund Order ID" variant="outlined" onChange={(e)=> setRefundOrderID(e.target.value)}/>
            <div/>
            <br />
            <Button variant="contained" className="refundAmount" onClick={refundTransaction}>
                Refund Transaction
            </Button>
            <br />
            <Button className="customerBalance" onClick={fetchCustomerBalance}>
                Fetch Customer Balance: {customerBalance}
            </Button>
            <br />
            <Button className="customerBalance" onClick={fetchContractBalance}>
                Fetch Contract Balance: {contractBalance}
            </Button>
        </div>
            <br /><br />
        <div id="market-div">
            <TextField id="outlined-basic" label="Order ID" variant="outlined" onChange={(e)=> setOrderIDValue(e.target.value)}/>
            <div/>
            <br />
            <TextField id="outlined-basic" label="Transfer Address" variant="outlined" onChange={(e)=> setRefundAddress(e.target.value)}/>
            <div/>
            <br />
            <Button variant="contained" className="refundAmount" onClick={transferOrderDetails}>
                Transfer
            </Button>
            <br />
        </div>
            {successSnackbar()}
            {errorSnackbar()}
        </div>
    );
}