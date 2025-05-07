import { useState } from "react";
import { AxiosResponse } from "axios";

import { actions as authActions } from "modules/auth";
import { Button, Modal, ButtonGroup, Container, Form } from "react-bootstrap";
import { ErrorAlert } from "modules/common";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import { useAppDispatch } from "hooks";
import { ApiPayloadData } from "modules/api";

interface Props {
    showModal: boolean;
    onHide: () => void;
}

const Login = ({ showModal, onHide }: Props) => {
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [_response, setResponse] = useState<AxiosResponse<ApiPayloadData>>();
    const [error, setError] = useState<unknown>();

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
                            try {
                                const response = await dispatch(
                                    authActions.authenticate(username, password),
                                );
                                setResponse(response);
                                onHideWrapper();
                            } catch (error: unknown) {
                                setError(error);
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                const response = await dispatch(
                                    authActions.register(username, password),
                                );
                                setResponse(response);
                                onHideWrapper();
                            } catch (error: unknown) {
                                setError(error);
                            }
                        }}
                    >
                        Register
                    </Button>
                </ButtonGroup>

                <LoginWithGoogleButton />

                <Container>
                    <ErrorAlert error={error} />
                </Container>
            </Modal.Footer>
        </Modal>
    );
};

export default Login;
