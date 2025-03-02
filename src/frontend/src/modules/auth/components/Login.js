import React, { useState } from "react";
import { connect } from "react-redux";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { Button, Modal, ButtonGroup, Container, Form, Alert } from "react-bootstrap";
import { HttpStatusCode } from "axios";
import { ResponseAlert } from "modules/common";
import LoginWithGoogleButton from "./LoginWithGoogleButton";

const Login = ({ authToken, authenticate, register, showModal, onHide }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(undefined);

    const onHideWrapper = () => {
        setUsername("");
        setPassword("");
        setResponse(undefined);
        onHide();
    };

    return (
        <Modal show={showModal} onHide={onHideWrapper}>
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
                        onClick={async () => {
                            const response = await authenticate(username, password);
                            setResponse(response);
                            if (response.status === HttpStatusCode.Ok) {
                                onHideWrapper();
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={async () => {
                            const response = await register(username, password);
                            setResponse(response);
                            if (response.status === HttpStatusCode.Ok) {
                                onHideWrapper();
                            }
                        }}
                    >
                        Register
                    </Button>
                </ButtonGroup>

                {response && (
                    <Container>
                        <ResponseAlert response={response} />
                    </Container>
                )}

                <LoginWithGoogleButton />
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
