import { RootState } from "store";

export const getToken = (state: RootState) => state.auth.token;
export const getUsername = (state: RootState) => state.auth.username;
export const getId = (state: RootState) => state.auth.id;
