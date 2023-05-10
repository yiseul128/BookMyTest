/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 9
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import DeleteCertification from "./DeleteCertification";

const Certifications = () => {
    const auth = useAuth();
    const [certifications, setCertifications] = useState([]);
    const [certificationCode, setCertificationCode] = useState("");
    
    const getAllCertifications = () => {
        const token = auth.getToken();

        axios
        .get(
            `${process.env.REACT_APP_BASE_URL_USER}/certifications`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .then((res) => {
            setCertifications(res.data);
        })
        .catch((error) => console.error(error));
    } 

    useEffect(() => {
        getAllCertifications();
    }, [certificationCode]);

    return (
        <Container>
            <h1>Certifications List</h1>
            <div className="contents-table">
                <Table>
                    <thead>
                        <tr>
                            <th>Certification Code</th>
                            <th>Certification Name</th>
                            <th>Passing Score</th>
                            <th>Fee</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {certifications.map((certification) => (
                            <tr key={certification.certificationCode}>
                                <td>{certification.certificationCode}</td>
                                <td>{certification.certificationName} </td>
                                <td>{certification.passingScore}</td>
                                <td>${certification.fee}</td>
                                <td>
                                    <Link
                                        to={`/update-certification/${certification.certificationCode}`}
                                    >
                                        <Button>Update</Button>
                                    </Link>
                                </td>
                                <td>
                                    <DeleteCertification 
                                        certificationCodeToDelete={certification.certificationCode} 
                                        getAllCertifications={getAllCertifications} certificationCode={certificationCode} setCertificationCode={setCertificationCode}></DeleteCertification>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="d-flex justify-content-center my-3">
            <Link
                to={`/add-certification`}
            >
                <Button>Add Certification</Button>
            </Link>
            </div>
        </Container>
    );
}

export default Certifications;