import axios, { HttpStatusCode } from "axios";

import { selectors as authSelectors, actions as authActions } from "modules/auth";

const buildUrl = (endpoint) => `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;

export const getRequest = async (endpoint, config) => {
    try {
        const response = await axios.get(buildUrl(endpoint), config);
        return response;
    } catch (e) {
        return e.response;
    }
};

export const postRequest = async (endpoint, body, config) => {
    try {
        const response = await axios.post(buildUrl(endpoint), body, config);
        return response;
    } catch (e) {
        return e.response;
    }
};

export const authenticatedPostRequest = (endpoint, body, config) => async (dispatch, getState) => {
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

export const authenticatedGetRequest = (endpoint, config) => async (dispatch, getState) => {
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
