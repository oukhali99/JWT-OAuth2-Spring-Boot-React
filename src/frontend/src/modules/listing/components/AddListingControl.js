import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ResponseAlert } from "modules/common";

const AddListingControl = ({ authenticatedPutRequest, refresh }) => {
    const [response, setResponse] = useState();
    const [priceDollars, setPriceDollars] = useState();
    const [title, setTitle] = useState();

    const addListing = async () => {
        setResponse(
            await authenticatedPutRequest("/listing", undefined, {
                params: { title, priceDollars },
            })
        );
        refresh();
    };

    return (
        <Container className="m-4">
            <ResponseAlert response={response} />
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
                <Button className="mt-2" onClick={addListing}>Add Listing</Button>
            </Form>
        </Container>
    );
};

export default AddListingControl;
