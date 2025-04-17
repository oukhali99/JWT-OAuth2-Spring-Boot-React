import React from "react";
import { Table } from "react-bootstrap";

import { Bid } from "..";

interface Props {
  bid: Bid;
}

const BidRow = ({ bid }: Props) => {
  return (
    <Table>
      <thead>
        <th>ID</th>
        <th>price</th>
        <th>owner</th>
      </thead>
      <tbody>
        <tr>
          <td>{bid.id}</td>
          <td>
            ${bid.price.dollars}.{bid.price.cents}
          </td>
          <td>{bid.bidder.username}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default BidRow;
