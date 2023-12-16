import { createReducer } from "@reduxjs/toolkit";

import { actions as authActions } from "modules/auth";

const initialState = {
    token: undefined,
};

export default createReducer(initialState, (builder) => {
    builder.addCase(authActions.setTokenAction, (state, action) => {
        const { token } = action.payload;
        state.token = token;
    });
});
