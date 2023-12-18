import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { HttpStatusCode } from "axios";
import { ResponseAlert } from "modules/common";
import { Button, ButtonGroup, Container, Table } from "react-bootstrap";
import { SocialButtons, actions as userActions } from "..";

const Users = ({ authToken, username, authenticatedPostRequest, addFriend }) => {
    const [response, setResponse] = useState(undefined);

    const refreshUsers = async () => {
        setResponse(await authenticatedPostRequest("/user/get-all"));
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
                        <th>Friends</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users
                        .filter((user) => user.username !== username)
                        .map((user) => (
                            <tr>
                                <td>{user?.id || "N/A"}</td>
                                <td>{user?.firstName || "N/A"}</td>
                                <td>{user?.lastName || "N/A"}</td>
                                <td>{user?.username || "N/A"}</td>
                                <td>{user?.authorityStringList?.join(", ") || "N/A"}</td>
                                <td>{user?.friendUsernameList?.join(", ") || "N/A"}</td>
                                <td style={{ textAlign: "center" }}>
                                    <SocialButtons user={user} refreshUsers={refreshUsers} />
                                </td>
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
    addFriend: userActions.addFriend,
};

export default connect(stateToProps, dispatchToProps)(Users);
