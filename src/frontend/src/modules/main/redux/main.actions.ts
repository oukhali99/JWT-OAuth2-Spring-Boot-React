import { createAction } from "@reduxjs/toolkit";

import { AppDispatch } from "store";

export const setAppStateAction = createAction("main/setAppStateAction");
export const incrementCounterAction = createAction("main/incrementCounterAction");

export const setAppState = () => (dispatch: AppDispatch) => {
    dispatch(setAppStateAction());
};

export const incrementCounter = () => (dispatch: AppDispatch) => {
    dispatch(incrementCounterAction());
};
