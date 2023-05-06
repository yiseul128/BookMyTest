/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 5
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Container, Button, Form, Row, Col, Alert } from "react-bootstrap"
import { useNavigate, Link } from 'react-router-dom';

const Login = ({setIsLoggedIn}) => {

  const [msg, setMsg] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.checkLoggedin()) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
        username,
        password,
      });
      
      const jwt = response.data.jwt;

      if (jwt) {
        auth.login(jwt);
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      setMsg("Login failed: please try again");
      console.error("Login error: ", error);
    }
  };

  return (
    <Container>
      <h1>Log in</h1>
      {(
        ()=>{
            if(msg){
                return(
                    <Alert variant='danger'>
                        {msg}
                    </Alert>
                )
            }
        }
      )()}
      
      <Form onSubmit={handleLogin}>
        <Row className='my-3'>
          <Col md>
            <Form.Group controlId='username'>
              <Form.Label>Username*</Form.Label>
              <Form.Control required type="text" placeholder='Enter username' onChange={e=> setUsername(e.target.value)} value={username}/>
            </Form.Group>
          </Col>
        </Row>

        <Row className='my-3'>
          <Col md>
            <Form.Group controlId='password'>
              <Form.Label>Password*</Form.Label>
              <Form.Control required type="password" placeholder='Enter password' onChange={e=> setPassword(e.target.value)} value={password}/>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center my-3">
          <Button type="submit">
            Log in
          </Button>
        </div>

        <div className="d-flex justify-content-center my-3">
          If you don't have an account yet, sign up today!
        </div>
        <div className="d-flex justify-content-center my-3">
          <Link to={`/signup/`}>
                <Button>Register</Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
