/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 13
 */

import { useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function NavBar ({isLoggedIn, setIsLoggedIn}) {
    const auth = useAuth();
    const [userRole , setUserRole] = useState(null);

    useEffect(() => {
      const currUser = auth.getUser();

      if(currUser!==null){
        setIsLoggedIn(true);
        setUserRole(auth.checkAdmin() ? "ADMIN" : "USER");
      }
      else{
        setIsLoggedIn(false);
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
                  {
                    userRole==="ADMIN" &&
                    <>
                      <Nav.Link as={Link} to="/test-centres" >Test Centres List</Nav.Link>
                      <Nav.Link as={Link} to="/certifications" >Certifications List</Nav.Link>
                    </>
                  }
                  {
                    userRole==="USER" &&
                    <>
                      <Nav.Link as={Link} to="/book-test" >Book Test</Nav.Link>
                      <Nav.Link as={Link} to="/history" >History</Nav.Link>
                    </>
                  } 
                  <Nav.Link as={Link} to="/profile" >Profile</Nav.Link>
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