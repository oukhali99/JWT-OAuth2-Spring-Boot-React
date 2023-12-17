import { HttpStatusCode } from "axios";
import React, { useMemo } from "react";
import { Alert, Container } from "react-bootstrap";

const ResponseAlert = ({ response }) => {
    const variant = useMemo(() => {
        switch (response.status) {
            case HttpStatusCode.Ok:
                return "success";
            case HttpStatusCode.InternalServerError:
            case HttpStatusCode.Forbidden:
                return "danger";
            default:
                return "";
        }
    }, [response]);

    const altMessage = useMemo(() => {
        switch (response.status) {
            case HttpStatusCode.Ok:
                return "Success";
            case HttpStatusCode.Forbidden:
                return "Access Denied";
            default:
                return "Failiure";
        }
    }, [response]);

    return (
        <Alert key={variant} variant={variant}>
            <Container>{response?.data?.body?.message || altMessage}</Container>
        </Alert>
    );
};

export default ResponseAlert;
