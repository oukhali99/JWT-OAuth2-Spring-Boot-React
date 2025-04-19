import React from "react";
import { Table } from "react-bootstrap";

import { Bid } from "..";

interface Props {
    bid: Bid;
}

const BidRow = ({ bid }: Props) => {
    return (
        <tr>
            <td>{bid.id}</td>
            <td>
                ${bid.price.dollars}.{bid.price.cents}
            </td>
            <td>{bid.bidder.username}</td>
        </tr>
    );
};

export default BidRow;
