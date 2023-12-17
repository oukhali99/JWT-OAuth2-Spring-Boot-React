import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { HttpStatusCode } from "axios";
import { ResponseAlert } from "modules/common";
import { Container, Table } from "react-bootstrap";

const Users = ({ authToken }) => {
    const [response, setResponse] = useState(undefined);

    useEffect(() => {
        (async () => {
            const res = await apiActions.getRequest("/user", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setResponse(res);
        })();
    }, [authToken, setResponse]);

    if (!response) {
        return undefined;
    }

    if (response?.status !== HttpStatusCode.Ok) {
        return <ResponseAlert response={response} />;
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
});

const dispatchToProps = {};

export default connect(stateToProps, dispatchToProps)(Users);
