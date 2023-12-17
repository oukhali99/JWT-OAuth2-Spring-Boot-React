import { createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { HttpStatusCode } from "axios";

import { actions as apiActions } from "modules/api";

export const setTokenAction = createAction("auth/setTokenAction");
export const clearTokenAction = createAction("auth/clearTokenAction");
export const loginSuccessAction = createAction("auth/loginSuccessAction");
export const logoutAction = createAction("auth/logoutAction");

export const setToken = (token) => (dispatch, getState) => {
    dispatch(setTokenAction({ token }));
};

export const clearToken = () => (dispatch, getState) => {
    dispatch(clearTokenAction());
};

export const authenticate = (username, password) => async (dispatch, getState) => {
    const response = await apiActions.postRequest("/auth/authenticate", null, {
        params: { username, password },
    });

    const status = response.status;
    if (status === HttpStatusCode.Ok) {
        const { username, token } = response.data;
        dispatch(loginSuccessAction({ token, username }));
    }

    return response;
};

export const register = (username, password) => async (dispatch, getState) => {
    const response = await apiActions.postRequest("/auth/register", null, {
        params: { username, password },
    });

    const status = response.status;
    if (status === HttpStatusCode.Ok) {
        const { username, token } = response.data;
        dispatch(loginSuccessAction({ token, username }));
    }

    return response;
};

export const logout = () => (dispatch, getState) => {
    dispatch(logoutAction());
};
