import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import BidRow from "./BidRow";

const BidRows = ({ listingId, authenticatedGetRequest }) => {
    const [response, setResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/bid/for-listing", { params: { listingId } }));
    };

    useEffect(() => {
        refresh();
    }, []);

    const bids = response?.data?.content;
    return <>{bids && bids.map((bid) => <BidRow bid={bid} />)}</>;
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(BidRows);
