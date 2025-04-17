import { createReducer } from "@reduxjs/toolkit";
import { actions as mainActions } from "..";

const initialState = {
  counter: 0,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(mainActions.setAppStateAction, (state, action) => {
    console.log("Do nothing");
  });

  builder.addCase(mainActions.incrementCounterAction, (state, action) => {
    state.counter++;
  });
});
