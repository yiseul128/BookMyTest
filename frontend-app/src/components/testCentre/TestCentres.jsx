/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 7
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import DeleteTestCentre from "./DeleteTestCentre";

const TestCentres = () => {
    const auth = useAuth();
    const [testCentres, setTestCentres] = useState([]);
    const [centreCode, setCentreCode] = useState("");

    const getAllCentres = () => {
        const token = auth.getToken();

        axios
        .get(
            `${process.env.REACT_APP_BASE_URL_USER}/testcentres`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .then((res) => {
            setTestCentres(res.data);
        })
        .catch((error) => console.error(error));
    }

    useEffect(() => {
        getAllCentres();
    }, [centreCode]);

    return (
        <Container>
            <h1>Test Centres List</h1>
            <div className="contents-table">
                <Table>
                    <thead>
                        <tr>
                            <th>Centre Code</th>
                            <th>Centre Name</th>
                            <th>Postal Code</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {testCentres.map((testCentre) => (
                            <tr key={testCentre.centreCode}>
                                <td>{testCentre.centreCode}</td>
                                <td>{testCentre.centreName} </td>
                                <td>{testCentre.postalCode} </td>
                                <td>
                                    <Link
                                        to={`/update-test-centre/${testCentre.centreCode}`}
                                    >
                                        <Button>Update</Button>
                                    </Link>
                                </td>
                                <td>
                                    <DeleteTestCentre 
                                        centreCodeToDelete={testCentre.centreCode} 
                                        getAllCentres={getAllCentres} centreCode={centreCode} setCentreCode={setCentreCode}></DeleteTestCentre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="d-flex justify-content-center my-3">
            <Link
                to={`/add-test-centre`}
            >
                <Button>Add Test Centre</Button>
            </Link>
            </div>
        </Container>
    );
};

export default TestCentres;
