import axios from "axios";

const buildUrl = (endpoint) => `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;

export const getRequest = async (endpoint, body, config) => {
    try {
        const response = await axios.get(buildUrl(endpoint), body, config);
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
