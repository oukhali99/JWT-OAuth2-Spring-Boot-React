import { HttpStatusCode } from "axios";
import React, { useMemo } from "react";
import { Alert, Container } from "react-bootstrap";

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

    const altMessage = response.status === HttpStatusCode.Ok ? "Success" : "Failiure";
    return (
        <Alert key={variant} variant={variant}>
            <Container>
                {response?.data?.message || altMessage}
            </Container>
        </Alert>
    );
};

export default ResponseAlert;
