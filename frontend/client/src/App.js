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

function App() {

    function AuthenticatedRoute({ children }) {
        const { loggedIn } = useContext(AuthContext);
        console.log(loggedIn);
        let location = useLocation();
        // if (!loggedIn) {
        //     return <Navigate to="/login" state={{ from: location }} replace />;
        // }
        return children;
    }


    return (

        <BrowserRouter>
            <Routes>
                <Route exact path="/signup/seller" element={<SignUpSeller />} />
                <Route exact path="/signup/buyer" element={<SignUpBuyer />} />
                <Route exact path="/login" element={<LoginPage />} />
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
                <Route exact path="*" element={<Navigate to="/home" />} />
            </Routes>
        </BrowserRouter >





        // <div className="App">
        //     <HomePage />
        // </div>
    );
}

export default App;
