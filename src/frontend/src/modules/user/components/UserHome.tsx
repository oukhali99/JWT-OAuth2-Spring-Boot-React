import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AxiosError, AxiosResponse } from "axios";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import {
  RefreshButton,
  ErrorAlert
} from "modules/common";
import { Button, Container, Table } from "react-bootstrap";
import { SocialButtons, OtherUser } from "..";
import { useAppDispatch, useAppSelector } from "hooks";
import { ApiPayloadData } from "modules/api";

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

  const refreshUsers = async () => {
    try {
      setResponse(await dispatch(apiActions.authenticatedGetRequest("/user")));
    } catch (error: any) {
      if (!(error instanceof AxiosError)) throw error;
      setError(error);
    }
  };

  const controls = (
    <Container className="mb-4">
      <ErrorAlert error={error} />
      <RefreshButton refresh={refreshUsers} />
    </Container>
  );

  useEffect(() => {
    refreshUsers();
  }, [authToken, setResponse]);

  if (response?.data?.errorCode !== "SUCCESS") {
    return <Container className="m-4">{controls}</Container>;
  }

  const otherUsers = response.data.content;
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
                  <Button /*onClick={() => navigate(`/user/${user?.user?.id}`)}*/
                  >
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
