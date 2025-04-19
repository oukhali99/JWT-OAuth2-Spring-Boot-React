import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { useAppDispatch } from "hooks";
import { actions as apiActions, ApiPayloadData } from "modules/api";
import { Bid, BidRow, BidSearchForm, BidSearchQuery } from "..";
import { Col, Container, Table } from "react-bootstrap";
import { ErrorAlert, LoadingButton } from "modules/common";

const BidHome = () => {
    const dispatch = useAppDispatch();

    const [bidSearchQuery, setBidSearchQuery] = useState<BidSearchQuery>();
    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData<Bid[]>>>();
    const [error, setError] = useState<unknown>();

    const refresh = async () => {
        try {
            setError(undefined);
            setResponse(
                await dispatch(apiActions.authenticatedPostRequest("/bid/search", bidSearchQuery || {}, {}))
            );
        }
        catch (error: any) {
            setError(error);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const controls = (
        <Col>
            <BidSearchForm bidSearchQuery={bidSearchQuery} setBidSearchQuery={setBidSearchQuery} />
            <LoadingButton onClick={refresh}>Refresh</LoadingButton>
            <ErrorAlert error={error} />
        </Col>
    );

    if (error || !response) return <Container className="m-4">{controls}</Container>;

    const bids = response.data.content;
    return (
        <Container className="m-4">
            {controls}
            <Table>
                <thead>
                    <tr>
                        <th>Bid ID</th>
                        <th>Bid Amount</th>
                        <th>Bidder Username</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid) => <BidRow key={bid.id} bid={bid} />)}
                </tbody>
            </Table>
        </Container>
    );
};

export default BidHome;
