import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import { actions as userActions } from "modules/user";
import { OtherUser } from "modules/user";
import { useAppDispatch } from "hooks";

interface Props {
    user: OtherUser;
    refreshUsers: () => Promise<void>;
};

const SocialButtons = ({ user, refreshUsers, ...rest } : Props) => {
    const dispatch = useAppDispatch();

    const firstButton = user?.isAFriend ? (
        <Button
            variant="danger"
            onClick={async () => {
                await dispatch(userActions.removeFriend(user?.user?.username));
                refreshUsers();
            }}
        >
            UnFriend
        </Button>
    ) : user?.selfSentThisPersonAFriendRequest ? (
        <Button
            variant="danger"
            onClick={async () => {
                await dispatch(userActions.removeFriend(user.user?.username));
                refreshUsers();
            }}
        >
            Cancel Request
        </Button>
    ) : user?.thisPersonSentSelfAFriendRequest ? (
        <Button
            onClick={async () => {
                await dispatch(userActions.addFriend(user.user?.username));
                refreshUsers();
            }}
            variant="success"
        >
            Accept Request
        </Button>
    ) : (
        <Button
            onClick={async () => {
                await dispatch(userActions.addFriend(user.user?.username));
                refreshUsers();
            }}
        >
            Add Friend
        </Button>
    );

    return (
        <ButtonGroup {...rest}>
            {firstButton}
            <Button variant="danger">Block</Button>
        </ButtonGroup>
    );
};

export default SocialButtons;
