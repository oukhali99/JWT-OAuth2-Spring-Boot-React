import { useEffect, useState } from "react";

import { actions as apiActions, ApiPayloadData } from "modules/api";
import { Container, Table, Modal, Button, ButtonGroup, Col, Row, Stack } from "react-bootstrap";
import { ErrorAlert, LoadingButton } from "modules/common";
import ListingRow from "./ListingRow";
import AddListingControl from "./AddListingControl";
import { useAppDispatch } from "hooks";
import { AxiosResponse } from "axios";
import { ListingSearchForm, Listing, ListingSearchQuery } from "..";

const ListingHome = () => {
    const dispatch = useAppDispatch();

    const [listingSearchQuery, setListingSearchQuery] = useState<ListingSearchQuery>();
    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData<Listing[]>>>();
    const [error, setError] = useState<unknown>();
    const [rowError, setRowError] = useState<unknown>();
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [showAddListingModal, setShowAddListingModal] = useState(false);

    const refresh = async () => {
        try {
            setError(undefined);
            setResponse(
                await dispatch(
                    apiActions.authenticatedPostRequest(
                        "/listing/search",
                        listingSearchQuery || {},
                        {},
                    ),
                ),
            );
            setRowError(undefined);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        refresh();
    }, [showFiltersModal, showAddListingModal]);

    const controls = (
        <Col>
            <Modal show={showFiltersModal} onHide={() => setShowFiltersModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Listings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListingSearchForm
                        listingSearchQuery={listingSearchQuery}
                        setListingSearchQuery={setListingSearchQuery}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFiltersModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddListingModal} onHide={() => setShowAddListingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddListingControl onAddListing={() => { refresh(); setShowAddListingModal(false) }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddListingModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row className="mt-4">
                <Stack direction="horizontal" gap={2}>
                    <ButtonGroup>
                        <Button variant="primary" onClick={() => setShowFiltersModal(true)}>
                            Filter
                        </Button>
                        <LoadingButton onClick={refresh}>Refresh</LoadingButton>
                    </ButtonGroup>
                    <Button
                        variant="primary"
                        onClick={() => setShowAddListingModal(true)}
                    >
                        Add Listing
                    </Button>
                </Stack>
            </Row>
            <Row className="mt-4">
                <ErrorAlert error={error} />
            </Row>
        </Col>
    );

    if (error || !response) return <Container className="m-4">{controls}</Container>;

    const listings = response.data.content;
    return (
        <Container className="m-4">
            <Row>{controls}</Row>
            <Row>
                <ErrorAlert error={rowError} />
            </Row>
            <Row className="mt-2">
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>title</th>
                            <th>owners</th>
                            <th>price</th>
                            <th>controls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => (
                            <ListingRow
                                listing={listing}
                                refresh={refresh}
                                setError={setRowError}
                            />
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default ListingHome;
