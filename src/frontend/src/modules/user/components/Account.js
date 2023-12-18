import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Alert, Button, ButtonGroup, Container } from "react-bootstrap";

import { selectors as authSelectors } from "modules/auth";
import { actions as apiActions } from "modules/api";
import { ResponseAlert } from "modules/common";
import { actions as userActions } from "modules/user";

const Account = ({ username, authenticatedPostRequest, addFriend, removeFriend }) => {
    const [response, setResponse] = useState(undefined);

    const refresh = async () => {
        const response = await authenticatedPostRequest("/user/get-self");
        setResponse(response);
    };

    useEffect(() => {
        refresh();
    }, []);

    if (!response) {
        return undefined;
    }

    const friendRequestUserList = response?.data?.obfuscatedSelf?.receivedFriendRequestUsernameList;
    return (
        <Container className="m-3">
            <ResponseAlert response={response} />
            Username: {username}
            {friendRequestUserList?.map((friendRequestUser) => (
                <Alert
                    variant="primary"
                    className="d-flex justify-content-between align-items-center"
                >
                    Request from: {friendRequestUser}
                    <ButtonGroup>
                        <Button
                            onClick={async () => {
                                await addFriend(friendRequestUser);
                                refresh();
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="danger"
                            onClick={async () => {
                                await removeFriend(friendRequestUser);
                                refresh();
                            }}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </Alert>
            ))}
        </Container>
    );
};

const stateToProps = (state) => ({
    username: authSelectors.getUsername(state),
});

const dispatchToProps = {
    authenticatedPostRequest: apiActions.authenticatedPostRequest,
    addFriend: userActions.addFriend,
    removeFriend: userActions.removeFriend,
};

export default connect(stateToProps, dispatchToProps)(Account);
