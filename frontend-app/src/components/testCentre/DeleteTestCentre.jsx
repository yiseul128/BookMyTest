/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 8
 */

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const DeleteTestCentre = (props) => {
    const auth = useAuth();

    const [ show, setShow ] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDeletingTestCentre = async() => {
        try {
            const token = auth.getToken();
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL_ADMIN}/testcentre/${props.centreCodeToDelete}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.centreCode) {
                props.setCentreCode("");
                props.getAllCentres();
            }
        } catch (error) {
            console.error("Deleting test centre error: ", error);
        }
        handleClose();
    }

    return (
        <>
            <Button variant="danger" onClick={handleShow}>Delete</Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this test centre?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="primary" onClick={handleDeletingTestCentre}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

} 

export default DeleteTestCentre;