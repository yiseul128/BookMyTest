/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 14
 */

import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Alert, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../../AuthContext";

const AddTestCentre = () => {
    const auth = useAuth();
    const [codeMsg, setCodeMsg] = useState();
    const [nameMsg, setNameMsg] = useState();
    const [postalCodeMsg, setPostalCodeMsg] = useState();
    const [msg, setMsg] = useState();
    const [variant, setVariant] = useState();
    const [testCentre, setTestCentre] = useState({
        centreCode: "",
        centreName: "",
        postalCode: "",
    });

    const handleAddingTestCentre = async(event) => {
        event.preventDefault();

        // reset alerts
        setMsg("");
        setCodeMsg("");
        setNameMsg("");
        setPostalCodeMsg("");

        try {
            const token = auth.getToken();
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL_ADMIN}/testcentre`, testCentre, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.centreCode) {
                setVariant('success');
                setMsg("Test centre added successfully!");
            }
        } catch (error) {
            setVariant('danger');

            if(error.response.data.errors){
                const errs = error.response.data.errors;

                for(let i=0; i<errs.length; i++){
                    switch(errs[i].field) {
                        case "centreCode":
                            setCodeMsg(errs[i].defaultMessage);
                            break;
                        case "centreName":
                            setNameMsg(errs[i].defaultMessage);
                            break;
                        case "postalCode":
                            setPostalCodeMsg(errs[i].defaultMessage);
                            break;
                        default:
                            break;
                    }
                }
            }
            else if(error.response?.data?.message){
                setCodeMsg(error.response.data.message);
            }
            else{
                setMsg("Adding test centre failed: please try again");
            }
            console.error("Adding test centre error: ", error);
        }
    };

    return (
        <Container>
            <h1>Add Test Centre</h1>
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

            <Form onSubmit={handleAddingTestCentre}>
                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="centreCode">
                            <Form.Label>Test Centre Code*</Form.Label>
                            {codeMsg && <Alert variant="danger">{codeMsg}</Alert>}
                            <Form.Control required type="text" placeholder="Enter test centre code (e.g. TC001)" onChange={e=>setTestCentre({...testCentre, centreCode: e.target.value})} value={testCentre.centreCode}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="centreName">
                            <Form.Label>Test Centre Name*</Form.Label>
                            {nameMsg && <Alert variant="danger">{nameMsg}</Alert>}
                            <Form.Control required type="text" placeholder="Enter test centre name" onChange={e=>setTestCentre({...testCentre, centreName: e.target.value})} value={testCentre.centreName}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="postalCode">
                            <Form.Label>Postal Code*</Form.Label>
                            {postalCodeMsg && <Alert variant="danger">{postalCodeMsg}</Alert>}
                            <Form.Control required type="text" placeholder="Enter postal code (e.g. M1M1M1)" onChange={e=>setTestCentre({...testCentre, postalCode: e.target.value})} value={testCentre.postalCode}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-center my-3">
                    <Button type="submit">
                        Add
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

export default AddTestCentre;