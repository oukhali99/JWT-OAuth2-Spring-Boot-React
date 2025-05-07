import { useMemo, useEffect } from "react";
import { AxiosError, HttpStatusCode } from "axios";
import { Alert } from "react-bootstrap";

import { ApiErrorCode, ApiPayloadData } from "modules/api";
import { actions as authActions } from "modules/auth";
import { useAppDispatch } from "hooks";

interface Props {
    axiosError: AxiosError<ApiPayloadData> | undefined;
}

export default ({ axiosError }: Props) => {
    const dispatch = useAppDispatch();

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
                        return "danger";
                    default:
                        return "";
                };
        }
    }, [axiosError]);

    const message = useMemo(() => {
        if (!axiosError.response?.data.errorCode) return `${axiosError.code}: ${axiosError.message}`;
        return `${axiosError.response?.data.errorCode}: ${axiosError.response?.data.content}`;
    }, [axiosError]);

    useEffect(() => {
        if (!axiosError.response) return;
        if (axiosError.response?.data.errorCode === ApiErrorCode.BAD_JWT_TOKEN) dispatch(authActions.logout());
    }, [axiosError]);

    return (
        <Alert key={variant} variant={variant}>
            {message}
        </Alert>
    );
};
