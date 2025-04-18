import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import { PriceRangeSearchForm, StringSearchForm, PriceRangeSearchQuery, StringSearchQuery } from "modules/common";
import { ListingSearchQuery } from "modules/listing";

interface Props {
    setListingSearchQuery: (listingSearchQuery?: ListingSearchQuery) => void;
};

const ListingSearchForm = ({ setListingSearchQuery }: Props) => {
    const [priceRangeSearchQuery, setPriceRangeSearchQuery] = useState<PriceRangeSearchQuery>();
    const [stringSearchQuery, setStringSearchQuery] = useState<StringSearchQuery>();

    useEffect(() => {
        setListingSearchQuery({ priceRangeSearchQuery: priceRangeSearchQuery, titleSearchQuery: stringSearchQuery });
    }, [priceRangeSearchQuery, stringSearchQuery]);

    return (
        <div>
            <Form.Group className="mb-3" controlId="searchString">
                <Form.Label>Search</Form.Label>
                <StringSearchForm setStringSearchQuery={setStringSearchQuery} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="priceRange">
                <Form.Label>Price Range</Form.Label>
                <PriceRangeSearchForm setPriceRangeSearchQuery={setPriceRangeSearchQuery} />
            </Form.Group>
        </div>
    );
};

export default ListingSearchForm;
