import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const setTokenAction = createAction("auth/setTokenAction");

export const setToken = (token) => (dispatch, getState) => {
    dispatch(setTokenAction({ token }));
};

export const authenticate = (username, password) => async (dispatch, getState) => {
    try {
        const response = await axios.post("http://localhost:8080/auth/authenticate", null, {
            params: { username, password },
        });

        const status = response.status;
        if (status === 200) {
            const { username, token } = response.data;
            dispatch(setToken(token));
        }
    } catch (e) {
        console.log(e);
    }
};

export const register = (username, password) => async (dispatch, getState) => {
    try {
        const response = await axios.post("http://localhost:8080/auth/register", null, {
            params: { username, password },
        });
    } catch (e) {
        console.log(e);
    }
};
