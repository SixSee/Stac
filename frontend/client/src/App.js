import './App.css';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from "./Components/SupplyChain";
import { useContext } from "react";
import { AuthContext } from "./context/Authcontext";
import LoginPage from "./Components/Login";
import SignUpSeller from "./Components/SignUpSeller";
import SignUpBuyer from "./Components/SignUpBuyer";
import UserHomePage from './Components/UserHomePage/src';
import VerifyOrder from "./Components/UserHomePage/common/VerifyOrder";

function App() {

    function AuthenticatedRoute({ children }) {
        const { loggedIn, logout } = useContext(AuthContext);
        console.log(loggedIn);
        let location = useLocation();
        // if (!loggedIn) {
        //     return <Navigate to="/login" state={{ from: location }} replace />;
        // }
        if (window.ethereum) {
            const { ethereum } = window;
            if (ethereum && ethereum.isMetaMask) {
                window.ethereum.on("accountsChanged", async ([newAddress]) => {
                        logout();
                    }
                );
            }
        }

        return children;
    }


    return (

        <BrowserRouter>
            <Routes>
                <Route exact path="/signup/seller" element={<SignUpSeller />} />
                <Route exact path="/signup/buyer" element={<SignUpBuyer />} />
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/verify_order" element={<VerifyOrder />} />
                {/* <Route
                    path="/home"
                    element={
                        <AuthenticatedRoute >
                            <HomePage />
                        </AuthenticatedRoute>
                    }
                /> */}
                <Route
                    path="/home"
                    element={
                        <AuthenticatedRoute >
                            <UserHomePage />
                        </AuthenticatedRoute>
                    }
                />
                <Route exact path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter >





        // <div className="App">
        //     <HomePage />
        // </div>
    );
}

export default App;
