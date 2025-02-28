import React from "react";

const ListingRow = ({ listing }) => (
    <tr key={listing?.id}>
        <td>{listing?.title}</td>
        <td>{listing?.owner?.email}</td>
        <td>{listing?.priceHumanReadable}</td>
        <td>{listing?.bids?.map((bid) => JSON.stringify(bid))}</td>
    </tr>
);

export default ListingRow;
