/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 6
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const RescheduleTest = () => {
    const id = useParams().id;

    const auth = useAuth();
    const [msg, setMsg] = useState();
    const [variant, setVariant] = useState();
    const [ test, setTest] = useState({
        testCode: "",
        centreCode: "",
        certificationCode: "",
        dateAndTime: "",
        status: "",
        candidateId: ""
    });
    const [certifications, setCertifications] = useState([]);
    const [testCentres, setTestCentres] = useState([]);

    useEffect(() => {
        const currUser = auth.getUser();
        if (currUser){
            setTest({...test, candidateId : currUser.userId});
        }
        try {
            const getCerts = async() => {
                const token = auth.getToken();
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL_USER}/certifications`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                setCertifications(response.data);
            } 

            const getCentres = async() => {
                const token = auth.getToken();
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL_USER}/testcentres`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setTestCentres(response.data);
            }

            const getTestToReschedule = async() => {
                const token = auth.getToken();
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL_USER}/test/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                setTest(response.data);
            }

            getCerts();
            getCentres();
            getTestToReschedule();
            
        } catch (error) {
            console.error("Getting cert, center, or test: ", error);
        }
    }, []);

    const handleReschedule = async (event) => {
        event.preventDefault();
    
        try {
            delete test.result;
            const token = auth.getToken();
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL_USER}/test/${test.testCode}`, {...test, status: "Rescheduled"}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.testCode) {
                console.log(response.data);
                setVariant('success');
                setMsg("Test rescheduled successfully!");
            }
        } catch (error) {
            setVariant('danger');
            setMsg("Rescheduling test failed: please check if you selected date & time that is at least 7 days away from the current date, and it does not conflict with other tests reserved.");
            console.error("Rescheduling test error: ", error);
        }
            
      };

    return (
        <Container>
            <h1>Reschedule Test</h1>
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

            <Form onSubmit={handleReschedule}>
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='centreCode'>
                        <Form.Label>Test Centre Code*</Form.Label>
                        <Form.Control as="select" required onChange={e=> setTest({...test, centreCode: e.target.value})} value={test.centreCode}>
                            <option></option>
                            {testCentres.map(tc => (
                            <option key={tc.centreCode} value={tc.centreCode}>{tc.centreCode}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                </Row>
        
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='certificationCode'>
                        <Form.Label>Certification Code*</Form.Label>
                        <Form.Control as="select" required onChange={e=> setTest({...test, certificationCode: e.target.value})} value={test.certificationCode}>
                            <option></option>
                            {certifications.map(c => (
                                <option key={c.certificationCode} value={c.certificationCode}>{c.certificationCode}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                </Row>
        
                <Row className='my-3'>
                <Col md>
                    <Form.Group controlId='dateAndTime'>
                    <Form.Label>Date and Time*</Form.Label>
                    <Form.Control required type="datetime-local" placeholder='Enter date and time' onChange={e=> setTest({...test, dateAndTime: e.target.value})} value={test.dateAndTime}/>
                    </Form.Group>
                </Col>
                </Row>

                <div className="d-flex justify-content-center my-3">
                <Button type="submit">
                    Reschedule
                </Button>
                </div>
            </Form>
        </Container>
    )
}

export default RescheduleTest;