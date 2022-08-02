import React, {useState} from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Snackbar, Stack} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Card from "@mui/material/Card";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VerifyOrder = () => {

    const theme = createTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [metamaskAccount, setMetamaskAccount] = useState('None');

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const [loginError, setLoginError] = useState('');
    const [stacID, setStacID] = useState('');

    const snackbar = () =>{
        return (
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {loginError}
                    </Alert>
                </Snackbar>
            </Stack>
        );
    }
    const queryParamOrderID = new URLSearchParams(window.location.search);
    console.log(queryParamOrderID);
    console.log(queryParamOrderID.get("orderId"));
    const loginUser=()=>{

        fetch(`${process.env.REACT_APP_BASE_URL}/order/verify/${queryParamOrderID.get("orderId")}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: email, password: password, token: queryParamOrderID.get("signature")})
        })
            .then((res) => {
                if (!res.ok) {
                    const err = new Error("Error");
                    err.response = res;
                    throw err.response.json();
                }
                return res.json();
            })
            .then((data) => {
                setStacID(data.stacId);
            })
            .catch((err) => {
                setOpen(true);
                err.then((data) => {
                    setLoginError(data.message);
                });
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };



    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Verify your Identity to see Stac Details
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Username"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={loginUser}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Container>
            <br/>
            {stacID!=='' &&
                <Card className="stacID">
                Please verify your StacID: {stacID}
            </Card>}
        </ThemeProvider>
    );
};

export default VerifyOrder;