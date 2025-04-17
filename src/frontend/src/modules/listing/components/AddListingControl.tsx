import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AxiosResponse } from "axios";

import { AxiosResponseAlert, ErrorAlert } from "modules/common";
import { actions as apiActions, ApiPayloadData } from "modules/api";
import { useAppDispatch } from "hooks";

interface Props {
    refresh: () => void;
};

const AddListingControl = ({ refresh }: Props) => {
    const dispatch = useAppDispatch();

    const [response, setResponse] = useState<AxiosResponse<ApiPayloadData>>();
    const [error, setError] = useState<unknown>();
    const [priceDollars, setPriceDollars] = useState<string>();
    const [title, setTitle] = useState<string>();

    const addListing = async () => {
        try {
            setResponse(
                await dispatch(apiActions.authenticatedPutRequest("/listing", {}, {
                    params: { title, priceDollars },
                })),
            );
            refresh();
        }
        catch (err) {
            setError(err);
        }
    };

    return (
        <Container className="m-4">
            <AxiosResponseAlert response={response} />
            <ErrorAlert error={error} />
            <Form>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                onChange={(e) => setPriceDollars(e.target.value)}
                                value={priceDollars}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button className="mt-2" onClick={addListing}>
                    Add Listing
                </Button>
            </Form>
        </Container>
    );
};

export default AddListingControl;
