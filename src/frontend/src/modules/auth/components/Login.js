import React, { useState } from "react";
import { connect } from "react-redux";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { Button, Modal, ButtonGroup, Container, Form } from "react-bootstrap";

const Login = ({ authToken, authenticate, register, showModal, onHide }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Modal show={showModal} onHide={onHide}>
            <Modal.Header>
                <h1>Login</h1>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="m-2">
                        <Form.Control
                            type="email"
                            placeholder="E-mail"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="m-2">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <ButtonGroup>
                    <Button onClick={() => authenticate(username, password)}>Login</Button>
                    <Button onClick={() => register(username, password)}>Register</Button>
                </ButtonGroup>
            </Modal.Footer>

            {authToken}
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
