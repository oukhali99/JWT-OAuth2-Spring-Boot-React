import React from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { connect } from "react-redux";

import { selectors as authSelectors } from "modules/auth";

const ListingRow = ({ listing, authenticatedDeleteRequest, authenticatedPutRequest, refresh, setResponse, authId }) => {
    const deleteListing = async listingId => {
        const response = await authenticatedDeleteRequest("/listing", { params: {listingId} });
        setResponse(response);
        if (response?.data?.errorCode === "SUCCESS") refresh();
    };

    const bidOnListing = async (listingId, priceDollars) => {
        const response = await authenticatedPutRequest("/bid", undefined, { params: {listingId, priceDollars} });
        setResponse(response);
        if (response?.data?.errorCode === "SUCCESS") refresh();
    }

    const controls = listing => (
        <Container>
            <ButtonGroup>
                <Button variant="primary" onClick={() => bidOnListing(listing?.id, 100)}>Bid</Button>
                {authId.toString() === listing?.owner?.id.toString() && <Button variant="danger" onClick={() => deleteListing(listing?.id)}>Delete</Button>}
            </ButtonGroup>
        </Container>
    );
    
    return (
        <tr key={listing?.id}>
            <td>{listing?.id}</td>
            <td>{listing?.title}</td>
            <td>{listing?.owner?.email}</td>
            <td>{listing?.priceHumanReadable}</td>
            <td>{listing?.bids?.map((bid) => JSON.stringify(bid))}</td>
            <td>{controls(listing)}</td>
        </tr>
    );
};

const stateToProps = (state) => ({
    authId: authSelectors.getId(state),
});

export default connect(stateToProps)(ListingRow);
