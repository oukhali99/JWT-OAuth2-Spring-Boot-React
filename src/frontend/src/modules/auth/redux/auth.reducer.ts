import { createReducer } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { actions as authActions } from "modules/auth";

interface StateType {
  token?: string;
  username?: string;
  id?: number;
}

const initialState = {
  token: Cookies.get("jwtToken"),
  username: Cookies.get("username"),
  id: parseInt(Cookies.get("id") || "0"),
} as StateType;

export default createReducer(initialState, (builder) => {
  builder.addCase(authActions.setTokenAction, (state, action) => {
    const { token } = action.payload;
    state.token = token;
    Cookies.set("jwtToken", token, { expires: 1 });
  });
  builder.addCase(authActions.clearTokenAction, (state) => {
    state.token = undefined;
    Cookies.remove("jwtToken");
  });
  builder.addCase(authActions.loginSuccessAction, (state, action) => {
    const { token, username, id } = action.payload;

    state.token = token;
    state.username = username;
    state.id = id;

    Cookies.set("jwtToken", token);
    Cookies.set("username", username);
    Cookies.set("id", id.toString());
  });
  builder.addCase(authActions.logoutAction, (state) => {
    state.token = undefined;
    state.username = undefined;
    state.id = undefined;

    Cookies.remove("jwtToken");
    Cookies.remove("username");
    Cookies.remove("id");
  });
});
