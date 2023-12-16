import React from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { About, CounterButton, Home } from "modules/main";
import Login from "modules/auth/components/Login";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Navbar bg="dark" data-bs-theme="dark">
                    <Container>
                        <Nav>
                            <LinkContainer to="/">
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/about">
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Container>
                </Navbar>

                <Container>
                    <Routes>
                        <Route path="/" Component={Home} />
                        <Route path="/about" Component={About} />
                        <Route path="/login" Component={Login} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
