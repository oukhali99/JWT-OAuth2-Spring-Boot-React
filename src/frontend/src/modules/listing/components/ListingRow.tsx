import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";

import { selectors as authSelectors } from "modules/auth";
import { actions as apiActions, ApiErrorCode } from "modules/api";
import ListingModal from "./ListingModal";
import { useAppDispatch, useAppSelector } from "hooks";
import { Listing } from "..";

interface Props {
    listing: Listing;
    refresh: () => void;
    setError: (error: unknown) => void;
}

const ListingRow = ({ listing, refresh, setError }: Props) => {
    const dispatch = useAppDispatch();
    const authId = useAppSelector(authSelectors.getId);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const deleteListing = async (listingId: number) => {
        try {
            const response = await dispatch(
                apiActions.authenticatedDeleteRequest("/listing", {
                    params: { listingId },
                }),
            );
            if (response.data.errorCode === ApiErrorCode.SUCCESS) refresh();
        } catch (error) {
            setError(error);
        }
    };

    const controls = (listing: Listing) => (
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
            <tr key={listing.id}>
                <td>{listing.id}</td>
                <td>{listing.title}</td>
                <td>{listing.owner?.email}</td>
                <td>{listing.priceHumanReadable}</td>
                <td>{controls(listing)}</td>
            </tr>
        </>
    );
};

export default ListingRow;
