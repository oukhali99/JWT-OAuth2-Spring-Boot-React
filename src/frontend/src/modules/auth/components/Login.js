import React from "react";
import { connect } from "react-redux";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { Button } from "react-bootstrap";

const Login = ({ authToken, authenticate, register }) => {
    return (
        <div>
            <h1>Login</h1>
            <Button onClick={() => authenticate("asd", "asd")}>Click me to login</Button>
            <Button onClick={() => register("asd", "asd")}>Click me to register</Button>
            {authToken}
        </div>
    );
};

const stateToProps = (state) => ({
    authToken: authSelectors.getToken(state),
});

const dispatchToProps = {
    authenticate: authActions.authenticate,
    register: authActions.register,
};

export default connect(stateToProps, dispatchToProps)(Login);
