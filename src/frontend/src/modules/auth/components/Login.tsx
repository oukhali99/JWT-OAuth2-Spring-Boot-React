import React, { useState } from "react";
import { connect } from "react-redux";
import { AxiosResponse, HttpStatusCode } from "axios";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { Button, Modal, ButtonGroup, Container, Form, Alert } from "react-bootstrap";
import { AxiosResponseAlert } from "modules/common";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import { useAppDispatch } from "hooks";
import { ApiPayloadData } from "modules/api";

interface Props {
    showModal: boolean;
    onHide: () => void;
};

const Login = ({ showModal, onHide }: Props) => {
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData>>();

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
                            const response = await dispatch(authActions.authenticate(username, password));
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
                            const response = await dispatch(authActions.register(username, password));
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
                        <AxiosResponseAlert response={response} />
                    </Container>
                )}

                <LoginWithGoogleButton />
            </Modal.Footer>
        </Modal>
    );
};

export default Login;
