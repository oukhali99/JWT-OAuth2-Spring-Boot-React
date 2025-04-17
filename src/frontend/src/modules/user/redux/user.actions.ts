import { createAction } from "@reduxjs/toolkit";

import { actions as apiActions } from "modules/api";
import { AppDispatch } from "store";

export const addFriend =
  (username: string) => async (dispatch: AppDispatch) => {
    await dispatch(
      apiActions.authenticatedPostRequest(
        "/user/add-friend",
        {},
        {
          params: { username },
        },
      ),
    );
  };

export const removeFriend =
  (username: string) => async (dispatch: AppDispatch) => {
    await dispatch(
      apiActions.authenticatedPostRequest(
        "/user/remove-friend",
        {},
        {
          params: { username },
        },
      ),
    );
  };
