import { createReducer } from "@reduxjs/toolkit";
import { actions as mainActions } from "..";

const initialState = {};

export default createReducer(initialState, (builder) => {
    builder.addCase(mainActions.setAppStateAction, (state, action) => {
        console.log("Do nothing");
    });
});
