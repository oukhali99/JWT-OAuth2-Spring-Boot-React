import axios, { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";

import { selectors as authSelectors, actions as authActions } from "modules/auth";
import { AppDispatch, AppGetState } from "store";
import { ApiErrorCode, ApiPayloadData } from "modules/api";

const buildUrl = (endpoint: string): string => `${import.meta.env.VITE_BACKEND_URL}${endpoint}`;

export const getRequest = async (endpoint: string, config: AxiosRequestConfig) => {
    const response = await axios.get(buildUrl(endpoint), config);
    return response as AxiosResponse<ApiPayloadData>;
};

export const postRequest = async (endpoint: string, body: object, config: AxiosRequestConfig) => {
    const response = await axios.post(buildUrl(endpoint), body, config);
    return response as AxiosResponse<ApiPayloadData>;
};

export const putRequest = async (endpoint: string, body: object, config: AxiosRequestConfig) => {
    const response = await axios.put(buildUrl(endpoint), body, config);
    return response as AxiosResponse<ApiPayloadData>;
};

export const deleteRequest = async (endpoint: string, config: AxiosRequestConfig) => {
    const response = await axios.delete(buildUrl(endpoint), config);
    return response as AxiosResponse<ApiPayloadData>;
};

export const authenticatedPostRequest =
    (endpoint: string, body: object, config: AxiosRequestConfig) =>
    async (_dispatch: AppDispatch, getState: AppGetState) => {
        const jwtToken = authSelectors.getToken(getState());
        return await postRequest(endpoint, body, {
            headers: {
                Authorization: jwtToken && `Bearer ${jwtToken}`,
            },
            ...config,
        });
    };

export const authenticatedGetRequest =
    (endpoint: string, config: AxiosRequestConfig = {}) =>
    async (_dispatch: AppDispatch, getState: AppGetState) => {
        const jwtToken = authSelectors.getToken(getState());
        return await getRequest(endpoint, {
            headers: {
                Authorization: jwtToken && `Bearer ${jwtToken}`,
            },
            ...config,
        });
    };

export const authenticatedPutRequest =
    (endpoint: string, body: object, config: AxiosRequestConfig) =>
    async (_dispatch: AppDispatch, getState: AppGetState) => {
        const jwtToken = authSelectors.getToken(getState());
        return await putRequest(endpoint, body, {
            headers: {
                Authorization: jwtToken && `Bearer ${jwtToken}`,
            },
            ...config,
        });
    };

export const authenticatedDeleteRequest =
    (endpoint: string, config: AxiosRequestConfig) =>
    async (_dispatch: AppDispatch, getState: AppGetState) => {
        const jwtToken = authSelectors.getToken(getState());
        return await deleteRequest(endpoint, {
            headers: {
                Authorization: jwtToken && `Bearer ${jwtToken}`,
            },
            ...config,
        });
    };
