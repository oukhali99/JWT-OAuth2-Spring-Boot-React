import { useState } from "react";
import { Table } from "react-bootstrap";

import { Bid } from "../models/Bid";
import DeleteBidButton from "./DeleteBidButton";
import { ErrorAlert } from "modules/common";

interface Props {
    bids: Bid[];
    refresh: () => Promise<void>;
}

const BidTable = ({ bids, refresh }: Props) => {
    const [error, setError] = useState<unknown>();

    return (
        <div>
            <ErrorAlert error={error} />
            <Table>
                <thead>
                    <tr>
                        <th>Bid ID</th>
                        <th>Bid Amount</th>
                        <th>Bidder Username</th>
                        <th>Controls</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid) => (
                        <tr>
                            <td>{bid.id}</td>
                            <td>
                                ${bid.price.dollars}.{bid.price.cents}
                            </td>
                            <td>{bid.bidder.username}</td>
                            <td><DeleteBidButton refresh={refresh} setError={setError} bid={bid} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default BidTable;
