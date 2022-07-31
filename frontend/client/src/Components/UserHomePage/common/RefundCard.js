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
import { ethers } from 'ethers';
import { AuthContext } from '../../../context/Authcontext';

export default function RefundCard({ item }) {
    const { user } = React.useContext(AuthContext);
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
                {user.role === 'BUYER' ? <><span style={{ color: "green" }}>Refund under progress</span></> : <>
                    <Button variant="contained" onClick={() => { }} size="small">Approve</Button>
                    <Button variant="contained" onClick={() => { }} size="small">Reject</Button>
                </>}
                {/* <Button size="small">Learn More</Button> */}
            </CardActions>
        </Card >
    );
}