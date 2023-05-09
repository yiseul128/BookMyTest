/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 7
 */

import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom';

const AdminProtectedComponent = (props) => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.checkAdmin()) {
      navigate("/");
    }
  }, [auth, navigate]);

  const ComponentToRender = props.comp;
  return (
    <>
      {React.createElement(ComponentToRender)}
    </>
  );
};

export default AdminProtectedComponent;