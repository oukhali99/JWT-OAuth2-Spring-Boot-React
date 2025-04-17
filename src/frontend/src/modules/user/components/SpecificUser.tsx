import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { actions as apiActions, ApiPayloadData } from "modules/api";
import { RefreshButton, ErrorAlert } from "modules/common";
import { Card, CardGroup, Container } from "react-bootstrap";
import { SocialButtons, OtherUser } from "modules/user";
import { selectors as authSelectors } from "modules/auth";
import { useAppDispatch, useAppSelector } from "hooks";
import { AxiosResponse } from "axios";

const SpecificUser = () => {
    const dispatch = useAppDispatch();
    const loggerInUserId = useAppSelector(authSelectors.getId);

    const { id: stringId } = useParams();
    if (!stringId) return undefined;
    const id = parseInt(stringId);

    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData<OtherUser>>>();
    const [error, setError] = useState<unknown>();

    const refresh = async () => {
        try {
            setResponse(await dispatch(apiActions.authenticatedGetRequest("/user/get-by-id", { params: { id } })));
        }
        catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        refresh();
    }, [id]);

    const controls = (
        <>
            <RefreshButton refresh={refresh} />
            <ErrorAlert error={error} />
        </>
    );
    if (response?.data?.errorCode !== "SUCCESS") {
        return controls;
    }

    const outerUser = response.data.content;
    const user = outerUser.user;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
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

export default SpecificUser;
