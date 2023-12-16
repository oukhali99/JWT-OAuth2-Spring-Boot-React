import React, { useState } from "react";
import { connect } from "react-redux";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { Button, Modal, ButtonGroup, Container, Form, Alert } from "react-bootstrap";
import { HttpStatusCode } from "axios";

const Login = ({ authToken, authenticate, register, showModal, onHide }) => {
    const [username, setUsername] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [response, setResponse] = useState(undefined);

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
                    <Button
                        onClick={async () => setResponse(await authenticate(username, password))}
                    >
                        Login
                    </Button>
                    <Button onClick={async () => setResponse(await register(username, password))}>
                        Register
                    </Button>
                </ButtonGroup>

                {response.status !== HttpStatusCode.Ok && (
                    <Container>
                        <Alert key="danger" variant="danger">
                            {JSON.stringify(response)}
                        </Alert>
                    </Container>
                )}
            </Modal.Footer>
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
