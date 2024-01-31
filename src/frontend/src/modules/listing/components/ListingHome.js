import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";

const ListingHome = ({ authenticatedGetRequest }) => {
    const [response, setResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/listing"));
    }

    useEffect(() => {
        refresh();
    }, []);

    if (response?.data?.errorCode !== "SUCCESS") {
        return undefined;
    }

    const listings = response?.data?.content;
    return <>{JSON.stringify(listings)}</>;
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(ListingHome);
