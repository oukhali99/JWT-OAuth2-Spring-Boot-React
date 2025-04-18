import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

import { PriceRangeSearchQuery, Price } from "modules/common";

interface Props {
    setPriceRangeSearchQuery: (priceRangeSearchQuery?: PriceRangeSearchQuery) => void;
};

const PriceRangeSearchForm = ({ setPriceRangeSearchQuery }: Props) => {
    const [minDollars, setMinDollars] = React.useState<number>();
    const [maxDollars, setMaxDollars] = React.useState<number>();
    const [minCents, setMinCents] = React.useState<number>();
    const [maxCents, setMaxCents] = React.useState<number>();

    useEffect(() => {
        if (minDollars === undefined || maxDollars === undefined || minCents === undefined || maxCents === undefined) {
            setPriceRangeSearchQuery(undefined);
            return;
        }
        const minPrice: Price = { dollars: minDollars, cents: minCents };
        const maxPrice: Price = { dollars: maxDollars, cents: maxCents };
        setPriceRangeSearchQuery({ min: minPrice, max: maxPrice });
    }, [minDollars, minCents, maxDollars, maxCents]);


    return (
        <div>
            <Form.Group controlId="minDollars">
                <Form.Label>Min Dollars</Form.Label>
                <Form.Control
                    type="number"
                    value={minDollars}
                    onChange={(e) => setMinDollars(Number(e.target.value))}
                />
            </Form.Group>
            <Form.Group controlId="minCents">
                <Form.Label>Min Cents</Form.Label>
                <Form.Control
                    type="number"
                    value={minCents}
                    onChange={(e) => setMinCents(Number(e.target.value))}
                />
            </Form.Group>
            <Form.Group controlId="maxDollars">
                <Form.Label>Max Dollars</Form.Label>
                <Form.Control
                    type="number"
                    value={maxDollars}
                    onChange={(e) => setMaxDollars(Number(e.target.value))}
                />
            </Form.Group>
            <Form.Group controlId="maxCents">
                <Form.Label>Max Cents</Form.Label>
                <Form.Control
                    type="number"
                    value={maxCents}
                    onChange={(e) => setMaxCents(Number(e.target.value))}
                />
            </Form.Group>
        </div>
    );
};

export default PriceRangeSearchForm;
