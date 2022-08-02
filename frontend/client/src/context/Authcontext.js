import React, { createContext, useState, useEffect } from "react";


export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authtoken = localStorage.getItem("authtoken");
        fetch(`${process.env.REACT_APP_BASE_URL}/auth/user/`, {
            method: "GET",
            headers: {
                'x-access-token': `${authtoken}`
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(res.status);
                else return res.json();
            })
            .then((data) => {
                if (data) {
                    console.log(data);
                    setLoggedIn(true);
                    setUser({ username: data.username, id: data._id, role: data.role });
                    console.log("bb")
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false));
    }, []);



    const logout = () => {
        setLoggedIn(false);
        setUser(null);
        localStorage.setItem("authtoken", null);
        window.location.pathname = "login";
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{ logout, loggedIn, user }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}
