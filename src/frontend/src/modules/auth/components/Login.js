import React from "react";
import { connect } from "react-redux";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { Button, Modal } from "react-bootstrap";

const Login = ({ authToken, authenticate, register, showModal, onHide }) => {
    return (
        <Modal show={showModal} onHide={onHide}>
            <h1>Login</h1>
            {authToken}
            <Button onClick={() => authenticate("asd", "asd")}>Click me to login</Button>
            <Button onClick={() => register("asd", "asd")}>Click me to register</Button>
        </Modal>
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
