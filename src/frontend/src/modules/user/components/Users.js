import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { RefreshButton, ResponseAlert } from "modules/common";
import { Button, Container, Table } from "react-bootstrap";
import { SocialButtons } from "..";

const StyledTd = styled.td`
    text-align: center;
`;

const StyledTh = styled.th`
    text-align: center;
`;

const Users = ({ authToken, username, authenticatedGetRequest }) => {
    const navigate = useNavigate();
    const [response, setResponse] = useState(undefined);

    const refreshUsers = async () => {
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
        return <Container className="m-4">{controls}</Container>;
    }

    const users = response?.data?.content || [];
    return (
        <Container className="m-4">
            {controls}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <StyledTh>Email</StyledTh>
                        <StyledTh>First Name</StyledTh>
                        <StyledTh>Last Name</StyledTh>
                        <StyledTh>Username</StyledTh>
                        <StyledTh>AuStyledThorities</StyledTh>
                        <StyledTh>Friends</StyledTh>
                        <StyledTh>More</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {users
                        .filter((user) => user.username !== username)
                        .map((user) => (
                            <tr>
                                <StyledTd>{user?.user?.email || "N/A"}</StyledTd>
                                <StyledTd>{user?.user?.firstName || "N/A"}</StyledTd>
                                <StyledTd>{user?.user?.lastName || "N/A"}</StyledTd>
                                <StyledTd>{user?.user?.username || "N/A"}</StyledTd>
                                <StyledTd>{user?.user?.authorityStringList?.join(", ") || "N/A"}</StyledTd>
                                <StyledTd style={{ textAlign: "center" }}>
                                    <SocialButtons user={user} refreshUsers={refreshUsers} />
                                </StyledTd>
                                <StyledTd>
                                    <Button onClick={() => navigate(`/user/${user?.user?.id}`)}>
                                        More
                                    </Button>
                                </StyledTd>
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
};

export default connect(stateToProps, dispatchToProps)(Users);
