import { createAction } from "@reduxjs/toolkit";

export const setAppStateAction = createAction("main/setAppStateAction");

export const setAppState = () => (dispatch, getState) => {
    dispatch(setAppStateAction());
};
