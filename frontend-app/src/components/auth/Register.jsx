/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 5
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Container, Button, Form, Row, Col, Alert } from "react-bootstrap"
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [msg, setMsg] = useState();
    const [ user, setUser] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "",
    });

    useEffect(() => {
        if (auth.checkLoggedin()) {
          navigate("/");
        }
    }, [auth, navigate]);
    
    const handleRegister = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, user);
    
            if (response.data.userId) {
                // Redirect to login
                navigate("/login");
            }
        } catch (error) {
            setMsg("Register failed: please try again");
            console.error("Register error: ", error);
        }
    };

    return (
        <Container>
            <h1>Register</h1>
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
            <Form onSubmit={handleRegister}>
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='username'>
                    <Form.Label>Username*</Form.Label>
                    <Form.Control required type="text" placeholder='Enter username' onChange={e=> setUser({...user, username: e.target.value})} value={user.username}/>
                    </Form.Group>
                </Col>
                </Row>
        
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='password'>
                    <Form.Label>Password*</Form.Label>
                    <Form.Control required type="password" placeholder='Enter password' onChange={e=> setUser({...user, password: e.target.value})} value={user.password}/>
                    </Form.Group>
                </Col>
                </Row>
        
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='firstName'>
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control required type="text" placeholder='Enter first name' onChange={e=> setUser({...user, firstName: e.target.value})} value={user.firstName}/>
                    </Form.Group>
                </Col>
                </Row>

                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='lastName'>
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control required type="text" placeholder='Enter last name' onChange={e=> setUser({...user, lastName: e.target.value})} value={user.lastName}/>
                    </Form.Group>
                </Col>
                </Row>

                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='role'>
                        <Form.Label>Role*</Form.Label>
                        <Form.Control as="select" required onChange={e=> setUser({...user, role: e.target.value})} value={user.role}>
                            <option></option>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                </Row>

                <div className="d-flex justify-content-center my-3">
                <Button type="submit">
                    Sign up
                </Button>
                </div>
            </Form>
        </Container>
    )
}

export default Register;