import { createReducer } from "@reduxjs/toolkit";
import { actions as mainActions } from "..";

const initialState = {
    counter: 0,
};

export default createReducer(initialState, (builder) => {
    builder.addCase(mainActions.setAppStateAction, (_state, _action) => {
        console.log("Do nothing");
    });

    builder.addCase(mainActions.incrementCounterAction, (state, _action) => {
        state.counter++;
    });
});
