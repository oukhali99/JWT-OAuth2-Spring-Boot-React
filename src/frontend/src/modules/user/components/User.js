import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { actions as apiActions } from "modules/api";
import { ResponseAlert } from "modules/common";
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

    const controls = <ResponseAlert response={response} />;
    if (response?.data?.errorCode !== "SUCCESS") {
        return controls;
    }

    const outerUser = response?.data?.content;
    const user = outerUser?.user;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    return (
        <Container className="m-4">
            {controls}
            <ListGroup>
                {firstName && <ListGroup.Item>First Name: {firstName}</ListGroup.Item>}
                {lastName && <ListGroup.Item>Last Name: {lastName}</ListGroup.Item>}
                <ListGroup.Item>E-Mail: {user?.email}</ListGroup.Item>
                <ListGroup.Item>Authorities: {user?.authorityStringList}</ListGroup.Item>
                <ListGroup.Item>
                    <SocialButtons user={outerUser} refreshUsers={refresh} />
                </ListGroup.Item>
            </ListGroup>
        </Container>
    );
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(User);
