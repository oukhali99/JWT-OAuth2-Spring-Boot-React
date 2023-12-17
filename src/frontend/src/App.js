import React, { useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";

import { About, Home } from "modules/main";
import { Users } from "modules/user";
import { selectors as authSelectors, Login, actions as authActions } from "modules/auth";

const App = ({ authToken, logout }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);

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
                            <LinkContainer to="/users">
                                <Nav.Link>Users</Nav.Link>
                            </LinkContainer>
                            {authToken === undefined ? (
                                <Nav.Link onClick={() => setShowLoginModal(true)}>Login</Nav.Link>
                            ) : (
                                <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
                            )}
                        </Nav>
                    </Container>
                </Navbar>

                <Container>
                    <Routes>
                        <Route path="/" Component={Home} />
                        <Route path="/about" Component={About} />
                        <Route path="/users" Component={Users} />
                    </Routes>
                    <Login showModal={showLoginModal} onHide={() => setShowLoginModal(false)} />
                </Container>
            </BrowserRouter>
        </div>
    );
};

const stateToProps = (state) => ({
    authToken: authSelectors.getToken(state),
});

const dispatchToProps = {
    setToken: authActions.setToken,
    logout: authActions.logout,
};

export default connect(stateToProps, dispatchToProps)(App);
