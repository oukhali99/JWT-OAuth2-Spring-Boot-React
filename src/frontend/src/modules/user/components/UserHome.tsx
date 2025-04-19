import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AxiosError, AxiosResponse } from "axios";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { RefreshButton, ErrorAlert, LoadingButton } from "modules/common";
import { Button, ButtonGroup, Col, Container, Modal, Row, Stack, Table } from "react-bootstrap";
import { SocialButtons, OtherUser, OtherUserSearchQuery } from "..";
import { useAppDispatch, useAppSelector } from "hooks";
import { ApiPayloadData } from "modules/api";
import OtherUserSearchForm from "./SearchForm/OtherUserSearchForm";

const StyledTd = styled.td`
    text-align: center;
`;

const StyledTh = styled.th`
    text-align: center;
`;

const UserHome = () => {
    const dispatch = useAppDispatch();
    const authToken = useAppSelector(authSelectors.getToken);
    const username = useAppSelector(authSelectors.getUsername);

    //const navigate = useNavigate();
    const [response, setResponse] = useState<
        AxiosResponse<ApiPayloadData<OtherUser[]>> | undefined
    >();
    const [error, setError] = useState<AxiosError>();
    const [otherUserSearchQuery, setOtherUserSearchQuery] = useState<OtherUserSearchQuery>();
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    const refreshUsers = async () => {
        try {
            setError(undefined);
            setResponse(await dispatch(apiActions.authenticatedPostRequest("/user/search", otherUserSearchQuery || {}, {})));
        } catch (error: any) {
            setError(error);
        }
    };

    const controls = (
        <Col>
            <Modal show={showFiltersModal} onHide={() => setShowFiltersModal(false)}>
                <Modal.Header>
                    <Modal.Title>Filter Users</Modal.Title>
                    <Button variant="close" onClick={() => setShowFiltersModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    <OtherUserSearchForm
                        otherUserSearchQuery={otherUserSearchQuery}
                        setOtherUserSearchQuery={setOtherUserSearchQuery}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFiltersModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Stack direction="horizontal" gap={2}>
                    <ButtonGroup>
                        <Button onClick={() => setShowFiltersModal(!showFiltersModal)}>
                            Filter
                        </Button>
                        <LoadingButton onClick={refreshUsers}>Refresh</LoadingButton>
                    </ButtonGroup>
                </Stack>
            </Row>
            <Row className="mt-2">
                <ErrorAlert error={error} />
            </Row>
        </Col>
    );

    useEffect(() => {
        refreshUsers();
    }, [authToken, setResponse, showFiltersModal]);

    if (error || !response) return <Container className="m-4">{controls}</Container>;

    const otherUsers = response.data.content;
    return (
        <Container className="m-4">
            {controls}
            <Table striped bordered hover className="mt-2">
                <thead>
                    <tr>
                        <StyledTh>Email</StyledTh>
                        <StyledTh>First Name</StyledTh>
                        <StyledTh>Last Name</StyledTh>
                        <StyledTh>Username</StyledTh>
                        <StyledTh>Authorities</StyledTh>
                        <StyledTh>Friends</StyledTh>
                        <StyledTh>More</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {otherUsers
                        .filter((otherUser) => otherUser.user.username !== username)
                        .map((otherUser) => (
                            <tr>
                                <StyledTd>{otherUser?.user?.email || "N/A"}</StyledTd>
                                <StyledTd>{otherUser?.user?.firstName || "N/A"}</StyledTd>
                                <StyledTd>{otherUser?.user?.lastName || "N/A"}</StyledTd>
                                <StyledTd>{otherUser?.user?.username || "N/A"}</StyledTd>
                                <StyledTd>
                                    {otherUser?.user?.authorityStringList?.join(", ") || "N/A"}
                                </StyledTd>
                                <StyledTd style={{ textAlign: "center" }}>
                                    <SocialButtons user={otherUser} refreshUsers={refreshUsers} />
                                </StyledTd>
                                <StyledTd>
                                    <Button /*onClick={() => navigate(`/user/${user?.user?.id}`)}*/>
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

export default UserHome;
