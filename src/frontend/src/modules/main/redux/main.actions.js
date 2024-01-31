import { createAction } from "@reduxjs/toolkit";

export const setAppStateAction = createAction("main/setAppStateAction");
export const incrementCounterAction = createAction("main/incrementCounterAction");

export const setAppState = () => (dispatch, getState) => {
    dispatch(setAppStateAction());
};

export const incrementCounter = () => (dispatch, getState) => {
    dispatch(incrementCounterAction());
};
