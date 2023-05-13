/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 12
 */

import React, { createContext, useContext } from 'react';
import decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const login = (authToken) => {
        localStorage.setItem('token', authToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
    }

    const checkLoggedin = () => {
        const decoded = getUser();

        // check if token exists
        if(decoded) {
            // check if the token is expired
            const expTimestamp = decoded.exp;
            const now = Math.floor(Date.now() / 1000); 
            if (now > expTimestamp) {
                logout();
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    const getUser = () => {
        const token = getToken();
        if(token!=null){
            return decode(token);
        }
        return null;
    }

    const getToken = () => {
        return localStorage.getItem("token");
    }

    const checkAdmin = () => {
        if(checkLoggedin()){
            const roles = getUser().roles;
            for(let i=0; i<roles.length; i++){
                if(roles[i] === "ADMIN"){
                    return true;
                }
            }
        }
        return false;
    }

    const value = {
        login, 
        logout,
        checkLoggedin,
        getUser,
        getToken,
        checkAdmin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}