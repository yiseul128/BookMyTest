/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 7
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