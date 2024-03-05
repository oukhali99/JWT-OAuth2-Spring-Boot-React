import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { actions as apiActions } from "modules/api";
import { RefreshButton, ResponseAlert } from "modules/common";
import { Card, CardGroup, Container } from "react-bootstrap";
import { SocialButtons } from "modules/user";
import { selectors as authSelectors } from "modules/auth";

const User = ({ authenticatedGetRequest, loggerInUserId }) => {
    const { id } = useParams();

    const [response, setResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/user/get-by-id", { params: { id } }));
    };

    useEffect(() => {
        refresh();
    }, [id]);

    const controls = (
        <>
            <RefreshButton refresh={refresh} />
            <ResponseAlert response={response} />
        </>
    );
    if (response?.data?.errorCode !== "SUCCESS") {
        return controls;
    }

    const outerUser = response?.data?.content;
    const user = outerUser?.user;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const email = user?.email;
    const isLoggedInUser = id === loggerInUserId;
    return (
        <Container className="m-4">
            <CardGroup
                style={{
                    marginTop: "2%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {firstName && (
                    <Card>
                        <Card.Header>First Name</Card.Header>
                        <Card.Body>{firstName}</Card.Body>
                    </Card>
                )}
                {lastName && (
                    <Card>
                        <Card.Header>Last Name</Card.Header>
                        <Card.Body>{lastName}</Card.Body>
                    </Card>
                )}
                <Card>
                    <Card.Header>E-Mail</Card.Header>
                    <Card.Body>{email}</Card.Body>
                </Card>
                <Card>
                    <Card.Header>Authorities</Card.Header>
                    <Card.Body>{user?.authorityStringList}</Card.Body>
                </Card>
            </CardGroup>
            {!isLoggedInUser && (
                <SocialButtons
                    user={outerUser}
                    refreshUsers={refresh}
                    style={{ marginTop: "2%" }}
                />
            )}
        </Container>
    );
};

const stateToProps = (state) => ({
    loggerInUserId: authSelectors.getId(state),
});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(User);
