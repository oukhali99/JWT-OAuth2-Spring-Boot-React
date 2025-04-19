import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { useAppDispatch } from "hooks";
import { actions as apiActions, ApiPayloadData } from "modules/api";
import { Bid, BidRow, BidSearchForm, BidSearchQuery } from "..";
import { Button, ButtonGroup, Col, Container, Modal, Row, Stack, Table } from "react-bootstrap";
import { ErrorAlert, LoadingButton } from "modules/common";

const BidHome = () => {
    const dispatch = useAppDispatch();

    const [bidSearchQuery, setBidSearchQuery] = useState<BidSearchQuery>();
    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData<Bid[]>>>();
    const [error, setError] = useState<unknown>();
    const [showFilterModal, setShowFilterModal] = useState(false);

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
    }, [showFilterModal]);

    const controls = (
        <Col>
            <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bid Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BidSearchForm bidSearchQuery={bidSearchQuery} setBidSearchQuery={setBidSearchQuery} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Stack direction="horizontal" gap={2}>
                    <ButtonGroup>
                        <Button onClick={() => setShowFilterModal(!showFilterModal)}>Filter</Button>
                        <LoadingButton onClick={refresh}>Refresh</LoadingButton>
                    </ButtonGroup>
                </Stack>
            </Row>
            <Row className="mt-2">
                <ErrorAlert error={error} />
            </Row>
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
