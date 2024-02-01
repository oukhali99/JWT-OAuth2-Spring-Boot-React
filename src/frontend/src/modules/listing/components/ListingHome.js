import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { actions as apiActions } from "modules/api";
import { Container, Table } from "react-bootstrap";
import { RefreshButton, ResponseAlert } from "modules/common";

const ListingHome = ({ authenticatedGetRequest }) => {
    const [response, setResponse] = useState();

    const refresh = async () => {
        setResponse(await authenticatedGetRequest("/listing"));
    };

    useEffect(() => {
        refresh();
    }, []);

    const controls = (
        <Container>
            <ResponseAlert response={response} />
            <RefreshButton refresh={refresh} />
        </Container>
    );

    if (response?.data?.errorCode !== "SUCCESS") {
        return controls;
    }

    const listings = response?.data?.content;
    return (
        <Container>
            <Container className="m-4">{controls}</Container>
            <Table>
                <thead>
                    <th>title</th>
                    <th>owners</th>
                    <th>price</th>
                    <th>bids</th>
                </thead>
                <tbody>
                    {listings.map((listing) => (
                        <tr>
                            <td>{listing?.title}</td>
                            <td>{listing?.owner?.email}</td>
                            <td>{listing?.priceHumanReadable}</td>
                            <td>{listing?.bids?.map((bid) => JSON.stringify(bid))}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    authenticatedGetRequest: apiActions.authenticatedGetRequest,
};

export default connect(stateToProps, dispatchToProps)(ListingHome);
