import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";

import { AxiosResponseAlert } from "modules/common";
import { BidRow } from "modules/bid";
import { actions as apiActions } from "modules/api";
import { selectors as authSelectors } from "modules/auth";

const ListingModal = ({
    show,
    onHide,
    listing,
    authenticatedPutRequest,
    authenticatedGetRequest,
    authId,
}) => {
    const [response, setResponse] = useState();
    const [price, setPrice] = useState();
    const [bidsResponse, setBidsResponse] = useState();

    const isMyListing = authId?.toString() === listing?.owner?.id?.toString();
    const placeHolderForPriceInput = isMyListing ? "Can't bid on your own listing" : "Price";

    const bidOnListing = async (listingId, priceDollars) => {
        const response = await authenticatedPutRequest("/bid", undefined, {
            params: { listingId, priceDollars },
        });
        setResponse(response);
        refreshBids();
        //if (response?.data?.errorCode === "SUCCESS") refresh();
    };

    const refreshBids = async () => {
        setBidsResponse(
            await authenticatedGetRequest("/bid/for-listing", {
                params: { listingId: listing?.id },
            }),
        );
    };

    useEffect(() => {
        refreshBids();
    }, []);

    const bids = bidsResponse?.data?.content;
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>{listing?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>ID</h4>
                <p>{listing?.id}</p>
                <h4>Owner</h4>
                <p>{listing?.owner?.email}</p>
                <h4>Bid</h4>
                {bids && bids.map((bid) => <BidRow bid={bid} />)}
                <AxiosResponseAlert response={bidsResponse} />
                <Row>
                    <Col xs={10}>
                        <Form.Control
                            type="number"
                            placeholder={placeHolderForPriceInput}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={isMyListing}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button onClick={() => bidOnListing(listing?.id, price)} disabled={!price}>
                            Bid
                        </Button>
                    </Col>
                </Row>
                <AxiosResponseAlert response={response} />
            </Modal.Body>
        </Modal>
    );
};

const stateToProps = (state) => ({
    authId: authSelectors.getId(state),
});

const dispatchToProps = {
    authenticatedPutRequest: apiActions.authenticatedPutRequest,
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(ListingModal);
