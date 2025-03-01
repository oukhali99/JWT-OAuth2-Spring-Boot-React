import React, { useState } from "react";
import { Button, ButtonGroup, Container, Modal, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";

import { selectors as authSelectors } from "modules/auth";
import { actions as apiActions } from "modules/api";
import ListingModal from "./ListingModal";

const ListingRow = ({
    listing,
    authenticatedDeleteRequest,
    authenticatedPutRequest,
    refresh,
    setResponse,
    authId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const deleteListing = async (listingId) => {
        const response = await authenticatedDeleteRequest("/listing", { params: { listingId } });
        setResponse(response);
        if (response?.data?.errorCode === "SUCCESS") refresh();
    };

    const controls = (listing) => (
        <Container>
            <ButtonGroup>
                <Button onClick={() => setIsModalOpen(true)}>More</Button>
                {authId?.toString() === listing?.owner?.id.toString() && (
                    <Button variant="danger" onClick={() => deleteListing(listing?.id)}>
                        Delete
                    </Button>
                )}
            </ButtonGroup>
        </Container>
    );

    return (
        <>
            <ListingModal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                listing={listing}
            />
            <tr key={listing?.id}>
                <td>{listing?.id}</td>
                <td>{listing?.title}</td>
                <td>{listing?.owner?.email}</td>
                <td>{listing?.priceHumanReadable}</td>
                <td>{controls(listing)}</td>
            </tr>
        </>
    );
};

const stateToProps = (state) => ({
    authId: authSelectors.getId(state),
});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
    authenticatedPutRequest: apiActions.authenticatedPutRequest,
    authenticatedDeleteRequest: apiActions.authenticatedDeleteRequest,
};

export default connect(stateToProps, dispatchToProps)(ListingRow);
