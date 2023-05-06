/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 5
 */

import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom';

const ProtectedComponent = (props) => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.checkLoggedin()) {
      navigate("/login");
    }
  }, [auth, navigate]);

  const ComponentToRender = props.comp;
  return (
    <>
      {React.createElement(ComponentToRender)}
    </>
  );
};

export default ProtectedComponent;