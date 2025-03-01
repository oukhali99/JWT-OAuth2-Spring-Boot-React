import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

import { ResponseAlert } from "modules/common";
import { BidRows } from "modules/bid";

const ListingModal = ({ show, onHide, listing, authenticatedPutRequest, authId }) => {
    const [response, setResponse] = useState();
    const [price, setPrice] = useState();

    const isMyListing = authId?.toString() === listing?.owner?.id?.toString();
    const placeHolderForPriceInput = isMyListing ? "Can't bid on your own listing" : "Price";

    const bidOnListing = async (listingId, priceDollars) => {
        const response = await authenticatedPutRequest("/bid", undefined, { params: {listingId, priceDollars} });
        setResponse(response);
        //if (response?.data?.errorCode === "SUCCESS") refresh();
    }

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
                <BidRows listingId={listing?.id} />
                <Row>
                    <Col xs={10}>
                        <Form.Control type="number" placeholder={placeHolderForPriceInput} value={price} onChange={e => setPrice(e.target.value)} disabled={isMyListing} />
                    </Col>
                    <Col xs={1}>
                        <Button onClick={() => bidOnListing(listing?.id, price)} disabled={!price}>Bid</Button>
                    </Col>
                </Row>
                <ResponseAlert response={response} />
            </Modal.Body>
        </Modal>
    );
}

export default ListingModal;
