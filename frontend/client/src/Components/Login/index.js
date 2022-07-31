import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useContext, useEffect, useState} from "react";
import MuiAlert from "@mui/material/Alert";
import {Snackbar, Stack} from "@mui/material";
import {AuthContext} from "../../context/Authcontext";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://amazon.in/">
                Amazon
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function LoginPage() {

    const {loggedIn} = useContext(AuthContext);

    useEffect(()=> {
        if (loggedIn) {
            window.location.pathname = "home";
        }
    },[]);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const [loginError, setLoginError] = useState('');

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


    const loginUser=()=>{
        fetch(`${process.env.REACT_APP_BASE_URL}/auth/login/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password: password })
        })
            .then((res) => {
                if(!res.ok){
                    const err = new Error("Error");
                    err.response = res;
                    throw err.response.json();
                }
                return res.json();
            })
            .then((data)=> {
                localStorage.setItem("authtoken", data.accessToken);
            })
            .then(()=> window.location.pathname= "/home")
            .catch((err)=>{
                setOpen(true);
                err.then((data)=> {
                    setLoginError(data.message);
                });
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };

    return (
        <>
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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            {/*<LockOutlinedIcon />*/}
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
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
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/forgotpassword" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
            {snackbar()}
        </>
    );
}