import { createAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { HttpStatusCode } from "axios";

import { actions as apiActions } from "modules/api";
import { AppDispatch } from "store";
import { ApiAuthResponse } from "..";

export const setTokenAction = createAction<{ token: string }>(
  "auth/setTokenAction",
);
export const clearTokenAction = createAction("auth/clearTokenAction");
export const loginSuccessAction = createAction<{
  token: string;
  username: string;
  id: number;
}>("auth/loginSuccessAction");
export const logoutAction = createAction("auth/logoutAction");

export const setToken = (token: string) => (dispatch: AppDispatch) => {
  dispatch(setTokenAction({ token }));
};

export const clearToken = () => (dispatch: AppDispatch) => {
  dispatch(clearTokenAction());
};

export const authenticate =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    const response = (await apiActions.postRequest(
      "/auth/authenticate",
      {},
      {
        params: { username, password },
      },
    )) as AxiosResponse<ApiAuthResponse>;

    const status = response.status;
    if (status === HttpStatusCode.Ok) {
      const { user, token } = response.data.content;
      const { username, id } = user;
      dispatch(loginSuccessAction({ token, username, id }));
    }

    return response;
  };

export const authenticateOrRegisterWithGoogle =
  (accessToken: string) => async (dispatch: AppDispatch) => {
    const response = (await apiActions.postRequest(
      "/auth/authenticate-or-register-with-google",
      {},
      {
        params: { accessToken },
      },
    )) as AxiosResponse<ApiAuthResponse>;

    const status = response.status;
    if (status === HttpStatusCode.Ok) {
      const { user, token } = response.data.content;
      const { username, id } = user;
      dispatch(loginSuccessAction({ token, username, id }));
    }

    return response;
  };

export const register =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    const response = (await apiActions.postRequest(
      "/auth/register",
      {},
      {
        params: { username, password },
      },
    )) as AxiosResponse<ApiAuthResponse>;

    const status = response.status;
    if (status === HttpStatusCode.Ok) {
      const { user, token } = response.data.content;
      const { username, id } = user;
      dispatch(loginSuccessAction({ token, username, id }));
    }

    return response;
  };

export const logout = () => (dispatch: AppDispatch) => {
  dispatch(logoutAction());
};
