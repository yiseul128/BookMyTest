/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 6
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";

const TestResult = () => {
    const auth = useAuth();
    const { id } = useParams();
    const [test, setTest] = useState({});

    useEffect(() => {
        const token = auth.getToken();
        axios
            .get(`${process.env.REACT_APP_BASE_URL_USER}/test/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                setTest(res.data);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <Container>
            <h1>Test Result</h1>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>Centre Code</th>
                        <td>{test.centreCode}</td>
                    </tr>
                    <tr>
                        <th>Certification Code</th>
                        <td>{test.certificationCode}</td>
                    </tr>
                    <tr>
                        <th>Date and Time</th>

                        <td>
                            {new Date(test.dateAndTime).toLocaleString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{test.status}</td>
                    </tr>
                    <tr>
                        <th>Score</th>
                        <td>{test.score}</td>
                    </tr>
                    <tr>
                        <th>Result</th>
                        <td>{test.result}</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default TestResult;
