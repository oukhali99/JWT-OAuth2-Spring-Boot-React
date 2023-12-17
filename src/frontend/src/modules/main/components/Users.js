import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { HttpStatusCode } from "axios";
import { ResponseAlert } from "modules/common";
import { Button, Container, Table } from "react-bootstrap";

const Users = ({ authToken, username, authenticatedPostRequest }) => {
    const [response, setResponse] = useState(undefined);

    const refreshUsers = async () => {
        const res = await authenticatedPostRequest("/user");
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
                        await authenticatedPostRequest("/user/add-authority", undefined, {
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

    const users = response?.data?.obfuscatedUserList || [];

    return (
        <Container className="m-4">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Authorities</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr>
                            <th>{user.id || "N/A"}</th>
                            <th>{user.firstName || "N/A"}</th>
                            <th>{user.lastName || "N/A"}</th>
                            <th>{user.username || "N/A"}</th>
                            <th>{user.authorityStringList.join(", ") || "N/A"}</th>
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

const dispatchToProps = {
    authenticatedPostRequest: apiActions.authenticatedPostRequest,
};

export default connect(stateToProps, dispatchToProps)(Users);
