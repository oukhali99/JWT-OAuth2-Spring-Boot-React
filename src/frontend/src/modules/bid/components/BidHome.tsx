import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { useAppDispatch } from "hooks";
import { actions as apiActions, ApiPayloadData } from "modules/api";
import { Bid, BidRow, BidSearchForm, BidSearchQuery } from "..";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Modal,
    Row,
    Stack,
    Table,
} from "react-bootstrap";
import { ErrorAlert, LoadingButton } from "modules/common";
import AddBidControl from "./AddBidControl";
import { Listing } from "modules/listing";
import BidTable from "./BidTable";

interface Props {
    listing?: Listing;
}

const BidHome = ({ listing }: Props) => {
    const dispatch = useAppDispatch();
    const listingId = listing?.id;

    const [bidSearchQuery, setBidSearchQuery] = useState<BidSearchQuery | undefined>({
        listingIdRangeSearchQuery: { min: listingId, max: listingId },
    });
    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData<Bid[]>>>();
    const [error, setError] = useState<unknown>();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showAddBidModal, setShowAddBidModal] = useState(false);

    const refresh = async () => {
        try {
            setError(undefined);
            setResponse(
                await dispatch(
                    apiActions.authenticatedPostRequest("/bid/search", bidSearchQuery || {}, {}),
                ),
            );
        } catch (error: any) {
            setError(error);
        }
    };

    useEffect(() => {
        refresh();
    }, [showFilterModal, showAddBidModal]);

    const controls = (
        <Col>
            <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bid Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BidSearchForm
                        bidSearchQuery={bidSearchQuery}
                        setBidSearchQuery={setBidSearchQuery}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {listing && (
                <Modal show={showAddBidModal} onHide={() => setShowAddBidModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Bid</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddBidControl listing={listing} onAdd={() => setShowAddBidModal(false)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddBidModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            <Row>
                <Stack direction="horizontal" gap={2}>
                    <ButtonGroup>
                        <Button onClick={() => setShowFilterModal(!showFilterModal)}>Filter</Button>
                        <LoadingButton onClick={refresh}>Refresh</LoadingButton>
                    </ButtonGroup>
                    {listing && (
                        <Button onClick={() => setShowAddBidModal(!showAddBidModal)}>
                            Add Bid
                        </Button>
                    )}
                </Stack>
            </Row>
            <Row className="mt-2">
                <ErrorAlert error={error} />
            </Row>
        </Col>
    );

    if (error || !response)
        return <Container className={listingId !== undefined ? "" : "m-4"}>{controls}</Container>;

    const bids = response.data.content;
    return (
        <Container className={listingId !== undefined ? "" : "m-4"}>
            {controls}
            <BidTable refresh={refresh} bids={bids} />
        </Container>
    );
};

export default BidHome;
