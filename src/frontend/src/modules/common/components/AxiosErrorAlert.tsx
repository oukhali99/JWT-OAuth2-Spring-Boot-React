import React, { useMemo } from "react";
import { AxiosError, HttpStatusCode } from "axios";
import { Alert } from "react-bootstrap";

interface Props {
    axiosError: AxiosError | undefined;
};

export default ({ axiosError } : Props) => {
    if (!axiosError) return <></>;

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
            {axiosError.message}
        </Alert>
    );
}
