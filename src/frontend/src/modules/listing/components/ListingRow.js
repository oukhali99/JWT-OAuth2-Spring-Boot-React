import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";

import { ResponseAlert } from "modules/common";

const ListingRow = ({ listing, authenticatedDeleteRequest, refresh, setResponse }) => {
    const deleteListing = async listingId => {
        const response = await authenticatedDeleteRequest("/listing", { params: {listingId} });
        setResponse(response);
        if (response?.data?.errorCode === "SUCCESS") refresh();
    };

    const controls = (
        <Container>
            <Button variant="danger" onClick={() => deleteListing(listing?.id)}>Delete</Button>
        </Container>
    );
    
    return (
        <tr key={listing?.id}>
            <td>{listing?.id}</td>
            <td>{listing?.title}</td>
            <td>{listing?.owner?.email}</td>
            <td>{listing?.priceHumanReadable}</td>
            <td>{listing?.bids?.map((bid) => JSON.stringify(bid))}</td>
            <td>{controls}</td>
        </tr>
    );
};

export default ListingRow;
