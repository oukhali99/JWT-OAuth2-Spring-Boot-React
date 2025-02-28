import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { Container, Row, Table } from "react-bootstrap";
import { ResponseAlert } from "modules/common";
import ListingRow from "./ListingRow";
import AddListingControl from "./AddListingControl";

const ListingHome = ({ authenticatedGetRequest, authenticatedPutRequest, authenticatedDeleteRequest }) => {
    const [response, setResponse] = useState();
    const [rowResponse, setRowResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/listing"));
        setRowResponse();
    };

    useEffect(() => {
        refresh();
    }, []);

    const controls = (
        <Container className="m-4">
            <ResponseAlert response={response} />
            <AddListingControl authenticatedPutRequest={authenticatedPutRequest} refresh={refresh} />
        </Container>
    );

    if (response?.data?.errorCode !== "SUCCESS") {
        return <Container className="m-4">{controls}</Container>;
    }

    const listings = response?.data?.content;
    return (
        <Container>
            {controls}
            <ResponseAlert response={rowResponse} />
            <Table>
                <thead>
                    <th>ID</th>
                    <th>title</th>
                    <th>owners</th>
                    <th>price</th>
                    <th>bids</th>
                </thead>
                <tbody>
                    {listings.map((listing) => (
                        <ListingRow listing={listing} authenticatedDeleteRequest={authenticatedDeleteRequest} authenticatedPutRequest={authenticatedPutRequest} refresh={refresh} setResponse={setRowResponse} />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
    authenticatedPutRequest: apiActions.authenticatedPutRequest,
    authenticatedDeleteRequest: apiActions.authenticatedDeleteRequest,
};

export default connect(stateToProps, dispatchToProps)(ListingHome);
