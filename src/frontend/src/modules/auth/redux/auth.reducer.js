import { createReducer } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { actions as authActions } from "modules/auth";

const initialState = {
    token: Cookies.get("jwtToken"),
};

export default createReducer(initialState, (builder) => {
    builder.addCase(authActions.setTokenAction, (state, action) => {
        const { token } = action.payload;
        state.token = token;
        Cookies.set("jwtToken", token, { expires: 1 });
    });
    builder.addCase(authActions.clearTokenAction, (state, action) => {
        state.token = undefined;
        Cookies.remove("jwtToken");
    });
});
