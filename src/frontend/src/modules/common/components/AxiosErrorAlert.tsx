import React, { useMemo } from "react";
import { AxiosError, HttpStatusCode } from "axios";
import { Alert } from "react-bootstrap";

import { ApiPayloadData } from "modules/api";

interface Props {
    axiosError: AxiosError<ApiPayloadData> | undefined;
};

export default ({ axiosError } : Props) => {
    if (!axiosError) return undefined;

    const variant = useMemo(() => {
        switch (axiosError.status) {
            case HttpStatusCode.Ok:
                return "success";
            case HttpStatusCode.InternalServerError:
            case HttpStatusCode.Forbidden:
                return "danger";
            default:
                return "";
        }
    }, [axiosError]);

    return (
        <Alert key={variant} variant={variant}>
            {axiosError.response?.data.errorCode} | {axiosError.response?.data.content}
        </Alert>
    );
}
