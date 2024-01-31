import { createReducer } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { actions as authActions } from "modules/auth";

const initialState = {
    token: Cookies.get("jwtToken"),
    username: Cookies.get("username"),
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
    builder.addCase(authActions.loginSuccessAction, (state, action) => {
        const { token, username } = action.payload;

        state.token = token;
        state.username = username;

        Cookies.set("jwtToken", token);
        Cookies.set("username", username);
    });
    builder.addCase(authActions.logoutAction, (state, action) => {
        state.token = undefined;
        state.username = undefined;

        Cookies.remove("jwtToken");
        Cookies.remove("username");
    });
});
