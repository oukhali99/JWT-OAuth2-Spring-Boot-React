import React from "react";
import { Button } from "react-bootstrap";

const ListingRow = ({ listing, authenticatedDeleteRequest, refresh }) => {
    const deleteListing = async listingId => {
        await authenticatedDeleteRequest("/listing", { params: {listingId} });
        refresh();
    };
    
    return (
        <tr key={listing?.id}>
            <td>{listing?.id}</td>
            <td>{listing?.title}</td>
            <td>{listing?.owner?.email}</td>
            <td>{listing?.priceHumanReadable}</td>
            <td>{listing?.bids?.map((bid) => JSON.stringify(bid))}</td>
            <td><Button variant="danger" onClick={() => deleteListing(listing?.id)}>Delete</Button></td>
        </tr>
    );
};

export default ListingRow;
