import React, { useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";

import { About, Home } from "modules/main";
import { Account, User, Users } from "modules/user";
import { selectors as authSelectors, Login, actions as authActions } from "modules/auth";
import { ListingHome } from "modules/listing";

const App = ({ authToken, logout, username }) => {
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
                            <LinkContainer to="/listing">
                                <Nav.Link>Listings</Nav.Link>
                            </LinkContainer>
                            {username === undefined ? (
                                <Nav.Link onClick={() => setShowLoginModal(true)}>Login</Nav.Link>
                            ) : (
                                <>
                                    <LinkContainer to="/account">
                                        <Nav.Link>Account</Nav.Link>
                                    </LinkContainer>
                                    <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Container>
                </Navbar>

                <Container>
                    <Routes>
                        <Route path="/" Component={Home} />
                        <Route path="/about" Component={About} />
                        <Route path="/users" Component={Users} />
                        <Route path="/listing" Component={ListingHome} />
                        <Route path="/account" Component={Account} />
                        <Route path="/user/:id" Component={User} />
                    </Routes>
                    <Login showModal={showLoginModal} onHide={() => setShowLoginModal(false)} />
                </Container>
            </BrowserRouter>
        </div>
    );
};

const stateToProps = (state) => ({
    authToken: authSelectors.getToken(state),
    username: authSelectors.getUsername(state),
});

const dispatchToProps = {
    setToken: authActions.setToken,
    logout: authActions.logout,
};

export default connect(stateToProps, dispatchToProps)(App);
