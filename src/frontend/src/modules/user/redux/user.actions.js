import { createAction } from "@reduxjs/toolkit";

import { actions as apiActions } from "modules/api";

export const addFriend = (username) => (dispatch, getState) => {
    dispatch(
        apiActions.authenticatedPostRequest("/user/add-friend", undefined, {
            params: { username },
        }),
    );
};
