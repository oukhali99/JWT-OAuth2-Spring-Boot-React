import React, { useMemo } from "react";
import { AxiosError, HttpStatusCode } from "axios";
import { Alert } from "react-bootstrap";

import { ApiPayloadData } from "modules/api";

interface Props {
    axiosError: AxiosError<ApiPayloadData> | undefined;
}

export default ({ axiosError }: Props) => {
    if (!axiosError) return undefined;

    const variant = useMemo(() => {
        switch (axiosError.status) {
            case HttpStatusCode.Ok:
                return "success";
            case HttpStatusCode.InternalServerError:
            case HttpStatusCode.Forbidden:
                return "danger";
            default:
                switch (axiosError.code) {
                    case AxiosError.ERR_NETWORK:
                    case AxiosError.ERR_BAD_OPTION:
                    case AxiosError.ERR_BAD_OPTION_VALUE:
                    case AxiosError.ERR_FR_TOO_MANY_REDIRECTS:
                    case AxiosError.ERR_DEPRECATED:
                    case AxiosError.ERR_NOT_SUPPORT:
                    case AxiosError.ERR_INVALID_URL:
                    case AxiosError.ECONNABORTED:
                    case AxiosError.ETIMEDOUT:
                        return "warning";
                    case AxiosError.ERR_BAD_REQUEST:
                    case AxiosError.ERR_BAD_RESPONSE:
                    case AxiosError.ERR_CANCELED:
                        return "info";
                    default:
                        return "";
                };
        }
    }, [axiosError]);

    const message = useMemo(() => {
        if (!axiosError.response) return `${axiosError.code}: ${axiosError.message}`;
        return `${axiosError.response?.data.errorCode}: ${axiosError.response?.data.content}`;
    }, [axiosError]);

    return (
        <Alert key={variant} variant={variant}>
            {message}
        </Alert>
    );
};
