import { createAction } from "@reduxjs/toolkit";

import { actions as apiActions } from "modules/api";

export const addFriend = (username) => async (dispatch, getState) => {
    await dispatch(
        apiActions.authenticatedPostRequest("/user/add-friend", undefined, {
            params: { username },
        }),
    );
};

export const removeFriend = (username) => async (dispatch, getState) => {
    await dispatch(
        apiActions.authenticatedPostRequest("/user/remove-friend", undefined, {
            params: { username },
        }),
    );
};
