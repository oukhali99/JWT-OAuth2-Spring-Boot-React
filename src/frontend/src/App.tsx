import { useState } from "react";
import { BrowserRouter,  Routes, Route, NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { About, Home } from "modules/main";
import { UserHome, SpecificUser } from "modules/user";
import {
    selectors as authSelectors,
    Login,
    actions as authActions,
    OAuthGoogleRedirect,
} from "modules/auth";
import { ListingHome } from "modules/listing";
import { useAppSelector, useAppDispatch } from "hooks";
import { BidHome } from "modules/bid";

const App = () => {
    const dispatch = useAppDispatch();
    const id = useAppSelector(authSelectors.getId);

    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div>
            <BrowserRouter>
                <Navbar bg="dark" data-bs-theme="dark">
                    <Container>
                        <Nav>
                            <NavLink to="/" className="navbar-brand">
                                Home
                            </NavLink>
                            <NavLink to="/about" className="navbar-brand">
                                About
                            </NavLink>
                            <NavLink to="/users" className="navbar-brand">
                                Users
                            </NavLink>
                            <NavLink to="/listing" className="navbar-brand">
                                Listings
                            </NavLink>
                            <NavLink to="/bid" className="navbar-brand">
                                Bids
                            </NavLink>
                            {id === undefined ? (
                                <NavLink
                                    to="/"
                                    className="navbar-brand"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Login
                                </NavLink>
                            ) : (
                                <>
                                    <NavLink to={`/user/${id}`} className="navbar-brand">
                                        Account
                                    </NavLink>
                                    <NavLink
                                        to="/"
                                        className="navbar-brand"
                                        onClick={() => dispatch(authActions.logout())}
                                    >
                                        Logout
                                    </NavLink>
                                </>
                            )}
                        </Nav>
                    </Container>
                </Navbar>

                <Container>
                    <Routes>
                        <Route path="/" Component={Home} />
                        <Route path="/about" Component={About} />
                        <Route path="/users" Component={UserHome} />
                        <Route path="/listing" Component={ListingHome} />
                        <Route path="/bid" Component={BidHome} />
                        <Route path="/user/:id" Component={SpecificUser} />
                        <Route path="/oauth-google-redirect" Component={OAuthGoogleRedirect} />
                    </Routes>
                    <Login showModal={showLoginModal} onHide={() => setShowLoginModal(false)} />
                </Container>
            </BrowserRouter>
        </div>
    );
};

export default App;
