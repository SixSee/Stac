import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { ethers } from "ethers";
import SupplyChain from "../../../artifacts/contracts/AmazonDelivery.sol/AmazonDelivery.json";
import { useState } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import QRCode from "react-qr-code";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function SoldItemCard({ item, sellerItem }) {
    console.log(item);
    const [QRCodeValue, setQRCodeValue] = useState("");

    const [open, setOpen] = React.useState(false);
    const handleOpen =  () => {
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const style = {
        color:"black",
        position: 'absolute',
        top: '60%',
        left: '60%',
        transform: 'translate(-50%, -50%)',
        width: '23%',
        height: "50%",
        bgcolor: 'background.paper',
        border: '1px solid grey',
        boxShadow: 24,
        p: 6,
        borderRadius: "12px"
    };

    const getQR = async (id, signedMessage) => {
        setQRCodeValue(`http://localhost:3000/verify_order?signature=${signedMessage}&orderId=${id}`);
        handleOpen();
    }


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
                    <span style={{ color: "black", display: "flex", justifyContent: "space-between", alignContent: "center" }} ><ProductionQuantityLimitsIcon style={{ color: "grey" }} /> {item.itemId.quantity}</span>
                    <span style={{ color: "black", display: "flex", justifyContent: "space-between", alignContent: "center" }} ><CurrencyRupeeIcon style={{ color: "grey" }} /> {item.itemId.price}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.itemId.description}
                </Typography>
            </CardContent>
            <CardActions>
                {sellerItem ? <Button variant="contained" size="small" onClick={()=> getQR(item._id, item.signedMessage)}>View QR</Button> : <></>}
            </CardActions >
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
                            <div style={{ background: 'white', padding: '16px' }}>
                                <QRCode value={QRCodeValue} />
                            </div>
                        </Box>
                    </Fade>
                </Modal>
                {/* <Button size="small">Learn More</Button> */}
        </Card >
    );
}