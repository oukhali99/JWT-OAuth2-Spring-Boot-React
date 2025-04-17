import React from "react";
import { AxiosError } from "axios";

import { AxiosErrorAlert } from "modules/common";
import { ApiPayloadData } from "modules/api";

const ErrorAlert = ({ error }: { error: unknown }) => {
    if (!error) return undefined;
    if (!(error instanceof AxiosError)) throw error;
    if (!error.response) throw error;
    return <AxiosErrorAlert axiosError={error as AxiosError<ApiPayloadData>} />;
};

export default ErrorAlert;
