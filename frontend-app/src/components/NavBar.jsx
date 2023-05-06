/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 6
 */

import { useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function NavBar ({isLoggedIn, setIsLoggedIn}) {
    const {checkLoggedin} = useAuth();

    useEffect(() => {
        if(checkLoggedin()){
          setIsLoggedIn(true);
        }
    }, [isLoggedIn])

    return ( 
      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Brand href="/">BookMyTest</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {isLoggedIn? (
                  <>
                    <Nav.Link as={Link} to="/book-test" >Book Test</Nav.Link>
                    <Nav.Link as={Link} to="/history" >History</Nav.Link>
                    <Nav.Link as={Link} to="/logout" >Log out</Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/login" >Log in</Nav.Link>
                )}
              </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
}