import React, { useEffect, useState } from "react";

import { actions as apiActions, ApiPayloadData } from "modules/api";
import { Container, Table } from "react-bootstrap";
import { ErrorAlert, RefreshButton } from "modules/common";
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

    const refresh = async () => {
        try {
            setError(undefined);
            setResponse(
                await dispatch(
                    apiActions.authenticatedPostRequest("/listing/search", listingSearchQuery || {}, {}),
                ),
            );
            setRowError(undefined);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const controls = (
        <Container className="m-4">
            <ListingSearchForm setListingSearchQuery={setListingSearchQuery} />
            <RefreshButton refresh={refresh} />
            <AddListingControl refresh={refresh} />
            <ErrorAlert error={error} />
        </Container>
    );

    if (error || !response) return <Container className="m-4">{controls}</Container>;

    const listings = response.data.content;
    return (
        <Container>
            {controls}
            <ErrorAlert error={rowError} />
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
                        <ListingRow listing={listing} refresh={refresh} setError={setRowError} />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ListingHome;
