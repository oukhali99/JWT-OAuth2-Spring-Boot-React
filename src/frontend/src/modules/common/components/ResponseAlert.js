import { HttpStatusCode } from "axios";
import React, { useMemo } from "react";
import { Alert } from "react-bootstrap";

const ResponseAlert = ({ response }) => {
    const variant = useMemo(() => {
        switch (response.status) {
            case HttpStatusCode.Ok:
                return "success";
            case HttpStatusCode.InternalServerError:
                return "danger";
            default:
                return "";
        }
    }, [response]);

    return (
        <Alert key={variant} variant={variant}>
            {response?.data?.message || JSON.stringify(response?.data)}
        </Alert>
    );
};

export default ResponseAlert;
