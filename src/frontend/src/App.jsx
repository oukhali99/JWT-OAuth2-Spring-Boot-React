import React, { useState } from "react";
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  Router,
  NavLink,
} from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";

import { About, Home } from "modules/main";
import { Account, UserHome, SpecificUser } from "modules/user";
import {
  selectors as authSelectors,
  Login,
  actions as authActions,
  OAuthGoogleRedirect,
} from "modules/auth";
import { ListingHome } from "modules/listing";

const App = ({ authToken, logout, username, id }) => {
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
                    onClick={() => logout()}
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
            <Route path="/user/:id" Component={SpecificUser} />
            <Route
              path="/oauth-google-redirect"
              Component={OAuthGoogleRedirect}
            />
          </Routes>
          <Login
            showModal={showLoginModal}
            onHide={() => setShowLoginModal(false)}
          />
        </Container>
      </BrowserRouter>
    </div>
  );
};

const stateToProps = (state) => ({
  authToken: authSelectors.getToken(state),
  username: authSelectors.getUsername(state),
  id: authSelectors.getId(state),
});

const dispatchToProps = {
  setToken: authActions.setToken,
  logout: authActions.logout,
};

export default connect(stateToProps, dispatchToProps)(App);
