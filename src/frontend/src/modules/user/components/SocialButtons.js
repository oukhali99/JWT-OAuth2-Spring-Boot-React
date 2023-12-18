import React from "react";
import { connect } from "react-redux";
import { Alert, Button, ButtonGroup } from "react-bootstrap";

import { actions as userActions } from "modules/user";
import { selectors as authSelectors } from "modules/auth";

const SocialButtons = ({ addFriend, user, selfUsername, removeFriend, refreshUsers }) => {
    const firstButton = user?.friendUsernameList?.includes(selfUsername) ? (
        <Button
            variant="danger"
            onClick={async () => {
                await removeFriend(user.username);
                refreshUsers();
            }}
        >
            UnFriend
        </Button>
    ) : user?.selfSentThisPersonAFriendRequest ? (
        <Button
            variant="danger"
            onClick={async () => {
                await removeFriend(user.username);
                refreshUsers();
            }}
        >
            Cancel Request
        </Button>
    ) : user?.thisPersonSentSelfAFriendRequest ? (
        <Button
            onClick={async () => {
                await addFriend(user.username);
                refreshUsers();
            }}
            variant="success"
        >
            Accept Request
        </Button>
    ) : (
        <Button
            onClick={async () => {
                await addFriend(user.username);
                refreshUsers();
            }}
        >
            Add Friend
        </Button>
    );

    return (
        <ButtonGroup>
            {firstButton}
            <Button variant="danger">Block</Button>
        </ButtonGroup>
    );
};

const stateToProps = (state) => ({
    selfUsername: authSelectors.getUsername(state),
});

const dispatchToProps = {
    addFriend: userActions.addFriend,
    removeFriend: userActions.removeFriend,
};

export default connect(stateToProps, dispatchToProps)(SocialButtons);
