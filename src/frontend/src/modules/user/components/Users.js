import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { RefreshButton, ResponseAlert } from "modules/common";
import { Container, Table } from "react-bootstrap";
import { SocialButtons, actions as userActions } from "..";

const Users = ({ authToken, username, authenticatedPostRequest, authenticatedGetRequest, addFriend }) => {
    const [response, setResponse] = useState(undefined);

    const refreshUsers = async () => {
        setResponse(undefined)
        setResponse(await authenticatedGetRequest("/user"));
    };

    const controls = (
        <Container className="mb-4">
            <ResponseAlert response={response} />
            <RefreshButton refresh={refreshUsers} />
        </Container>
    );

    useEffect(() => {
        refreshUsers();
    }, [authToken, setResponse]);

    if (response?.data?.errorCode !== "SUCCESS") {
        return (
            <Container>
                {controls}
            </Container>
        );
    }

    const users = response?.data?.content || [];
    return (
        <Container className="m-4">
            {controls}
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
                                <td>{user?.user?.id || "N/A"}</td>
                                <td>{user?.user?.firstName || "N/A"}</td>
                                <td>{user?.user?.lastName || "N/A"}</td>
                                <td>{user?.user?.username || "N/A"}</td>
                                <td>{user?.user?.authorityStringList?.join(", ") || "N/A"}</td>
                                <td>{user?.user?.friendUsernameList?.join(", ") || "N/A"}</td>
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
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
    authenticatedPostRequest: apiActions.authenticatedPostRequest,
    addFriend: userActions.addFriend,
};

export default connect(stateToProps, dispatchToProps)(Users);
