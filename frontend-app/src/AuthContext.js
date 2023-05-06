/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 5
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
        if(localStorage.getItem('token')) {
            return true;
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

    const value = {
        login, 
        logout,
        checkLoggedin,
        getUser,
        getToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}