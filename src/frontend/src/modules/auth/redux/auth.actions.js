import { createAction } from "@reduxjs/toolkit";

export const setTokenAction = createAction("auth/setTokenAction");

export const setToken = (token) => (dispatch, getState) => {
    dispatch(setTokenAction({ token }));
};
