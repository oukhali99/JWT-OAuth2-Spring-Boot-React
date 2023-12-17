import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { HttpStatusCode } from "axios";
import { ResponseAlert } from "modules/common";

const Users = ({ authToken }) => {
    const [response, setResponse] = useState(undefined);

    useEffect(() => {
        (async () => {
            const res = await apiActions.getRequest("/user", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setResponse(res);
        })();
    }, [authToken, setResponse]);

    if (!response) {
        return undefined;
    }

    if (response?.status !== HttpStatusCode.Ok) {
        return (
            <ResponseAlert response={response} />
        );
    }

    return <>{JSON.stringify(response)}</>;
};

const stateToProps = (state) => ({
    authToken: authSelectors.getToken(state),
});

const dispatchToProps = {};

export default connect(stateToProps, dispatchToProps)(Users);
