import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { HttpStatusCode } from "axios";
import { ResponseAlert } from "modules/common";
import { Button, Container, Table } from "react-bootstrap";

const Users = ({ authToken, username }) => {
    const [response, setResponse] = useState(undefined);

    const refreshUsers = async () => {
        const res = await apiActions.getRequest("/user", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        setResponse(res);
    };

    useEffect(() => {
        refreshUsers();
    }, [authToken, setResponse]);

    if (!response) {
        return undefined;
    }

    if (response?.status !== HttpStatusCode.Ok) {
        return (
            <Container className="m-4">
                <ResponseAlert response={response} />
                <Button
                    onClick={async () => {
                        await apiActions.getRequest("/user/add-authority", {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            },
                            params: {
                                username,
                                authority: "ADMIN",
                            },
                        });
                        refreshUsers();
                    }}
                >
                    Become Admin
                </Button>
            </Container>
        );
    }

    const users = response.data;

    return (
        <Container className="m-4">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr>
                            <th>{user.id || "N/A"}</th>
                            <th>{user.firstName || "N/A"}</th>
                            <th>{user.lastName || "N/A"}</th>
                            <th>{user.username || "N/A"}</th>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

const stateToProps = (state) => ({
    authToken: authSelectors.getToken(state),
    username: authSelectors.getUsername(state),
});

const dispatchToProps = {};

export default connect(stateToProps, dispatchToProps)(Users);
