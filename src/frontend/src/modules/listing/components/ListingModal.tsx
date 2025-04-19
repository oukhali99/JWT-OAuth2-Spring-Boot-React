import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { AxiosResponse } from "axios";

import { AxiosErrorAlert, ErrorAlert, Price } from "modules/common";
import { BidRow, Bid, BidHome } from "modules/bid";
import { actions as apiActions, ApiPayloadData } from "modules/api";
import { selectors as authSelectors } from "modules/auth";
import { useAppDispatch, useAppSelector } from "hooks";
import { Listing } from "..";

interface Props {
    show: boolean;
    onHide: () => void;
    listing: Listing;
}

const ListingModal = ({ show, onHide, listing }: Props) => {
    const dispatch = useAppDispatch();
    const authId = useAppSelector(authSelectors.getId);

    const [error, setError] = useState<unknown>();
    const [price, setPrice] = useState<number>();

    const isMyListing = authId?.toString() === listing.owner.id.toString();
    const placeHolderForPriceInput = isMyListing ? "Can't bid on your own listing" : "Price";

    const bidOnListing = async (listingId: number, priceDollars?: number) => {
        try {
            await dispatch(
                apiActions.authenticatedPutRequest(
                    "/bid",
                    {},
                    {
                        params: { listingId, priceDollars },
                    },
                ),
            );
            //if (response?.data?.errorCode === "SUCCESS") refresh();
        } catch (error) {
            setError(error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{listing?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>ID</h4>
                <p>{listing.id}</p>
                <h4>Owner</h4>
                <p>{listing.owner.email}</p>
                <h4>Bid</h4>
                <Row>
                    <Col xs={10}>
                        <Form.Control
                            type="number"
                            placeholder={placeHolderForPriceInput}
                            value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                            disabled={isMyListing}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button onClick={() => bidOnListing(listing.id, price)} disabled={!price}>
                            Bid
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <ErrorAlert error={error} />
                </Row>
                <Row className="mt-3">
                    <BidHome listingId={listing.id} />
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ListingModal;
