import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { PriceRangeSearchQuery, PriceForm } from "modules/common";

interface Props {
    priceRangeSearchQuery?: PriceRangeSearchQuery;
    setPriceRangeSearchQuery: (priceRangeSearchQuery?: PriceRangeSearchQuery) => void;
};

const PriceRangeSearchForm = ({ priceRangeSearchQuery, setPriceRangeSearchQuery }: Props) => {
    const [minPrice, setMinPrice] = useState(priceRangeSearchQuery?.min);
    const [maxPrice, setMaxPrice] = useState(priceRangeSearchQuery?.max);

    useEffect(() => {
        setPriceRangeSearchQuery({ min: minPrice, max: maxPrice });
    }, [minPrice, maxPrice]);


    return (
        <div>
            <Form.Group>
                <Form.Label>Min Price</Form.Label>
                <PriceForm price={minPrice} setPrice={setMinPrice} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Max Price</Form.Label>
                <PriceForm price={maxPrice} setPrice={setMaxPrice} />
            </Form.Group>
        </div>
    );
};

export default PriceRangeSearchForm;
