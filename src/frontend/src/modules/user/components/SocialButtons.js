import React from "react";
import { connect } from "react-redux";
import { Button, ButtonGroup } from "react-bootstrap";

import { actions as userActions } from "modules/user";
import { selectors as authSelectors } from "modules/auth";

const SocialButtons = ({ addFriend, user, selfUsername }) => {
    const firstButton = user?.friendUsernameList?.includes(selfUsername) ? (
        <Button>Message</Button>
    ) : (
        <Button onClick={() => addFriend(user.username)}>Add Friend</Button>
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
};

export default connect(stateToProps, dispatchToProps)(SocialButtons);
