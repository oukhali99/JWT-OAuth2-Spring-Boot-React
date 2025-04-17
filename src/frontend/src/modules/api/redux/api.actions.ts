import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { AppDispatch, AppGetState } from "store";
import { ApiPayloadData } from "modules/api";

const buildUrl = (endpoint: string): string => `${import.meta.env.VITE_BACKEND_URL}${endpoint}`;

export const getRequest = async (endpoint: string, config: AxiosRequestConfig) => {
    try {
        const response = await axios.get(buildUrl(endpoint), config);
        return response as AxiosResponse<ApiPayloadData>;
    }
    catch (error: any) {
        if (!(error instanceof AxiosError)) throw error;
        if (!error.response) throw error;
        return error.response as AxiosResponse<ApiPayloadData>;
    }
};

export const postRequest = async (endpoint: string, body: object, config: AxiosRequestConfig) => {
    try {
        const response = await axios.post(buildUrl(endpoint), body, config);
        return response as AxiosResponse<ApiPayloadData>;
    }
    catch (error: any) {
        if (!(error instanceof AxiosError)) throw error;
        if (!error.response) throw error;
        return error.response as AxiosResponse<ApiPayloadData>;
    }
};

export const putRequest = async (endpoint: string, body: object, config: AxiosRequestConfig) => {
    try {
        const response = await axios.put(buildUrl(endpoint), body, config);
        return response as AxiosResponse<ApiPayloadData>;
    }
    catch (error: any) {
        if (!(error instanceof AxiosError)) throw error;
        if (!error.response) throw error;
        return error.response as AxiosResponse<ApiPayloadData>;
    }
};

export const deleteRequest = async (endpoint: string, config: AxiosRequestConfig) => {
    try {
        const response = await axios.delete(buildUrl(endpoint), config);
        return response as AxiosResponse<ApiPayloadData>;
    }
    catch (error: any) {
        if (!(error instanceof AxiosError)) throw error;
        if (!error.response) throw error;
        return error.response as AxiosResponse<ApiPayloadData>;
    }
};

export const authenticatedPostRequest = (endpoint: string, body: object, config: AxiosRequestConfig) => async (dispatch: AppDispatch, getState: AppGetState) => {
    const jwtToken = authSelectors.getToken(getState());
    const response = await postRequest(endpoint, body, {
        headers: {
            Authorization: jwtToken && `Bearer ${jwtToken}`,
        },
        ...config,
    });

    if (response?.status !== HttpStatusCode.Ok && response?.data?.errorCode === "BAD_JWT_TOKEN") {
        console.log("Bad JWT token, logging out");
        dispatch(authActions.logout());
    }

    return response;
};

export const authenticatedGetRequest = (endpoint: string, config: AxiosRequestConfig = {}) => async (dispatch: AppDispatch, getState: AppGetState) => {
    const jwtToken = authSelectors.getToken(getState());
    const response = await getRequest(endpoint, {
        headers: {
            Authorization: jwtToken && `Bearer ${jwtToken}`,
        },
        ...config,
    });

    if (response?.status !== HttpStatusCode.Ok && response?.data?.errorCode === "BAD_JWT_TOKEN") {
        console.log("Bad JWT token, logging out");
        dispatch(authActions.logout());
    }

    return response;
};

export const authenticatedPutRequest = (endpoint: string, body: object, config: AxiosRequestConfig) => async (dispatch: AppDispatch, getState: AppGetState) => {
    const jwtToken = authSelectors.getToken(getState());
    const response = await putRequest(endpoint, body, {
        headers: {
            Authorization: jwtToken && `Bearer ${jwtToken}`,
        },
        ...config,
    });

    if (response?.status !== HttpStatusCode.Ok && response?.data?.errorCode === "BAD_JWT_TOKEN") {
        console.log("Bad JWT token, logging out");
        dispatch(authActions.logout());
    }

    return response;
};

export const authenticatedDeleteRequest = (endpoint: string, config: AxiosRequestConfig) => async (dispatch: AppDispatch, getState: AppGetState) => {
    const jwtToken = authSelectors.getToken(getState());
    const response = await deleteRequest(endpoint, {
        headers: {
            Authorization: jwtToken && `Bearer ${jwtToken}`,
        },
        ...config,
    });

    if (response?.status !== HttpStatusCode.Ok && response?.data?.errorCode === "BAD_JWT_TOKEN") {
        console.log("Bad JWT token, logging out");
        dispatch(authActions.logout());
    }

    return response;
};
