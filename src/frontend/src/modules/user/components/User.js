import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { actions as apiActions } from "modules/api";
import { RefreshButton, ResponseAlert } from "modules/common";
import { Container, ListGroup } from "react-bootstrap";
import SocialButtons from "./SocialButtons";

const User = ({ authenticatedGetRequest }) => {
    const { id } = useParams();

    const [response, setResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/user/get-by-id", { params: { id } }));
    };

    useEffect(() => {
        refresh();
    }, []);

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
    return (
        <Container className="m-4">
            <div
                style={{
                    marginTop: "2%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ListGroup style={{ width: "75%" }}>
                    <div style={{ marginBottom: "2%" }}>{controls}</div>
                    {firstName && (
                        <ListGroup.Item>
                            <h2>First Name:</h2> {firstName}
                        </ListGroup.Item>
                    )}
                    {lastName && <ListGroup.Item>Last Name: {lastName}</ListGroup.Item>}
                    <ListGroup.Item>
                        <h4>E-Mail</h4> {user?.email}
                    </ListGroup.Item>
                    <ListGroup.Item>Authorities: {user?.authorityStringList}</ListGroup.Item>
                    <ListGroup.Item>
                        <SocialButtons user={outerUser} refreshUsers={refresh} />
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </Container>
    );
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(User);
