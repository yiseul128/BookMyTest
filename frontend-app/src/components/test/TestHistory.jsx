/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 6
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

//CONSTANTS
const STATUS_COMPLETED = "Completed";

// Upcoming tests => reschedule button
// Completed tests => result button
const TestHistory = () => {
    const auth = useAuth();
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const token = auth.getToken();
        const currUser = auth.getUser();
        if(currUser){
            axios
            .get(
                `${process.env.REACT_APP_BASE_URL_USER}/tests/bycandidate/${currUser.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            .then((res) => {
                setTests(res.data);
            })
            .catch((error) => console.error(error));
        }
    }, []);

    return (
        <Container>
            <h1>Test Result</h1>
            <div className="contents-table">
                <Table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Centre </th>
                            <th>Certification</th>
                            <th>Status </th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {tests.map((test) => (
                            <tr key={test.testCode}>
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
                                <td>{test.centreCode}</td>
                                <td>{test.certificationCode} </td>
                                <td>{test.status} </td>
                                {test.status === STATUS_COMPLETED ? (
                                    <td>
                                        <Link to={`/test-result/${test.testCode}`}>
                                            <Button>Result</Button>
                                        </Link>
                                    </td>
                                ) : (
                                    <td>
                                        <Link
                                            to={`/reschedule-test/${test.testCode}`}
                                        >
                                            <Button>Reschedule</Button>
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default TestHistory;
