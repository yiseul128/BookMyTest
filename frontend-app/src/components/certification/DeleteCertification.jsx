/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 9
 */

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const DeleteCertification = (props) => {
    const auth = useAuth();

    const [ show, setShow ] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDeletingCertification = async() => {
        try {
            const token = auth.getToken();
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL_ADMIN}/certification/${props.certificationCodeToDelete}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.certificationCode) {
                props.setCertificationCode("");
                props.getAllCertifications();
            }
        } catch (error) {
            console.error("Deleting certification error: ", error);
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
                    Are you sure you want to delete this certification?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="primary" onClick={handleDeletingCertification}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

} 

export default DeleteCertification;