/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 10
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../../AuthContext";

const Profile = () => {
    const auth = useAuth();
    const userId = auth.getUser().userId;
    const token = auth.getToken();
    const [msg, setMsg] = useState();
    const [variant, setVariant] = useState();
    const [user, setUser] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [pwds, setPwds] = useState({
        oldPassword: "",
        newPassword: ""
    })

    useEffect(() => {
        try{
            const getUserInfo = async() => {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL_USER}/user/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                response.data.password = "";
                setUser(response.data);
            }

            getUserInfo();
        }
        catch(error){
            console.log("Getting user: ", error);
        }
    }, [])

    const handleUpdatingProfile = async(event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL_USER}/update-profile/${userId}`, user, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.userId) {
                setVariant('success');
                setMsg("Profile updated successfully!");
            }
        }
        catch(error) {
            setVariant('danger');
            setMsg("Updating profile failed: "); // TODO: err msg display
            console.error("Updating profile error: ", error);
        }
    }

    const handleChangingPwd = async(event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL_USER}/change-password/${userId}`, pwds, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.includes("success")) {
                setVariant('success');
                setMsg("Password reset successfully!");
            }
        }
        catch(error) {
            setVariant('danger');
            setMsg("Resetting password failed: "); // TODO: err msg display
            console.error("Resetting password error: ", error);
        }
    }

    return (
        <Container>
            <h1>Profile</h1>
            {(
                ()=>{
                    if(msg){
                        return(
                            <Alert variant={variant}>
                                {msg}
                            </Alert>
                        )
                    }
                }
            )()}
            <Form onSubmit={handleUpdatingProfile}>
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='username'>
                    <Form.Label>Username*</Form.Label>
                    <Form.Control disabled type="text" placeholder='Enter username' onChange={e=> setUser({...user, username: e.target.value})} value={user.username}/>
                    </Form.Group>
                </Col>
                </Row>
        
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='password'>
                    <Form.Label>Password*</Form.Label>
                    <Form.Control required type="password" placeholder='Enter current password' onChange={e=> setUser({...user, password: e.target.value})} value={user.password}/>
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
                    Update Profile
                </Button>
                </div>
            </Form>

            <h2>Change Password</h2>
            <Form onSubmit={handleChangingPwd}>        
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='currPassword'>
                    <Form.Label>Current Password*</Form.Label>
                    <Form.Control required type="password" placeholder='Enter current password' onChange={e=> setPwds({...pwds, oldPassword: e.target.value})} value={pwds.oldPassword}/>
                    </Form.Group>
                </Col>
                </Row>

                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='password'>
                    <Form.Label>New Password*</Form.Label>
                    <Form.Control required type="password" placeholder='Enter new password' onChange={e=> setPwds({...pwds, newPassword: e.target.value})} value={pwds.newPassword}/>
                    </Form.Group>
                </Col>
                </Row>

                <div className="d-flex justify-content-center my-3">
                <Button type="submit">
                    Change
                </Button>
                </div>
            </Form>
        </Container>
        
    )
}

export default Profile;