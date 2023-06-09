/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 13
 */

import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Alert, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../../AuthContext";

const AddCertification = () => {
    const auth = useAuth();
    const [msg, setMsg] = useState();
    const [codeMsg, setCodeMsg] = useState();
    const [nameMsg, setNameMsg] = useState();
    const [scoreMsg, setScoreMsg] = useState();
    const [feeMsg, setFeeMsg] = useState();
    const [variant, setVariant] = useState();
    const [certification, setCertification] = useState({
        certificationCode: "",
        certificationName: "",
        passingScore: "",
        fee: ""
    });

    const handleAddingCertification = async(event) => {
        event.preventDefault();

        // reset alerts
        setMsg("");
        setCodeMsg("");
        setNameMsg("");
        setScoreMsg("");
        setFeeMsg("");

        try {
            const token = auth.getToken();
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL_ADMIN}/certification`, certification, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.certificationCode) {
                setVariant('success');
                setMsg("Certification added successfully!");
            }
        } catch (error) {
            setVariant('danger');

            if(error.response.data.errors){
                const errs = error.response.data.errors;

                for(let i=0; i<errs.length; i++){
                    switch(errs[i].field) {
                        case "certificationCode":
                            setCodeMsg(errs[i].defaultMessage);
                            break;
                        case "certificationName":
                            setNameMsg(errs[i].defaultMessage);
                            break;
                        case "passingScore":
                            setScoreMsg(errs[i].defaultMessage);
                            break;
                        case "fee":
                            setFeeMsg(errs[i].defaultMessage);
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
                setMsg("Adding certification failed: please try again");
            }
       
            console.error("Adding certification error: ", error);
        }
    }

    return (
        <Container>
            <h1>Add Certification</h1>
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

            <Form onSubmit={handleAddingCertification}>
                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="certificationCode">
                            <Form.Label>Certification Code*</Form.Label>
                            {codeMsg && <Alert variant="danger">{codeMsg}</Alert>}
                            <Form.Control required type="text" placeholder="Enter certification code (e.g. AAA-001)" onChange={e=>setCertification({...certification, certificationCode: e.target.value})} value={certification.certificationCode}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="certificationName">
                            <Form.Label>Certification Name*</Form.Label>
                            {nameMsg && <Alert variant="danger">{nameMsg}</Alert>}
                            <Form.Control required type="text" placeholder="Enter certification name" onChange={e=>setCertification({...certification, certificationName: e.target.value})} value={certification.certificationName}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="passingScore">
                            <Form.Label>Passing Score*</Form.Label>
                            {scoreMsg && <Alert variant="danger">{scoreMsg}</Alert>}
                            <Form.Control required type="number" placeholder="Enter passing score (e.g. 80)" onChange={e=>setCertification({...certification, passingScore: +e.target.value})} value={certification.passingScore}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="my-3">
                    <Col md>
                        <Form.Group controlId="fee">
                            <Form.Label>Fee*</Form.Label>
                            {feeMsg && <Alert variant="danger">{feeMsg}</Alert>}
                            <Form.Control required type="text" placeholder="Enter fee in $ (e.g. 10)" onChange={e=>setCertification({...certification, fee: +e.target.value})} value={certification.fee}></Form.Control>
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

export default AddCertification;