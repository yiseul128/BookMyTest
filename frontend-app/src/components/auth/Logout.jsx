/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 5
 */

import { useAuth } from "../../AuthContext";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Logout = ({ setIsLoggedIn}) => {
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        auth.logout();
        setIsLoggedIn(false);
        navigate("/");
    });

    return null; 
}

export default Logout;