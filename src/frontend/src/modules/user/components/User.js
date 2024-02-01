import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { actions as apiActions } from "modules/api";
import { ResponseAlert } from "modules/common";

const User = ({ authenticatedGetRequest }) => {
    const { id } = useParams();

    const [response, setResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/user/get-by-id", { params: { id } }));
    };

    useEffect(() => {
        refresh();
    }, []);

    const controls = <ResponseAlert response={response} />;
    if (response?.data?.errorCode !== "SUCCESS") {
        return controls;
    }

    const user = response?.data?.content;
    return (
        <>
            {controls}
            {JSON.stringify(user)}
        </>
    );
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(User);
