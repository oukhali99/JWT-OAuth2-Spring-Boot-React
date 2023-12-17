import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";

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

    return <>{JSON.stringify(response)}</>;
};

const stateToProps = (state) => ({
    authToken: authSelectors.getToken(state),
});

const dispatchToProps = {};

export default connect(stateToProps, dispatchToProps)(Users);
