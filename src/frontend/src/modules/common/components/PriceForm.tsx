import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap"

import { Price } from "modules/common";

interface Props {
    price?: Price;
    setPrice: (price?: Price) => void;
}

const PriceForm = ({ price, setPrice }: Props) => {
    const [dollars, setDollars] = useState(price?.dollars);
    const [cents, setCents] = useState(price?.cents);

    useEffect(() => {
        if (dollars === undefined && cents === undefined) {
            setPrice(undefined);
            return;
        }
        setPrice({ dollars: dollars || 0, cents: cents || 0 });
    }, [dollars, cents]);

    return (
        <div>
            <Row>                
                <Col>
                    <Form.Label>Dollars</Form.Label>
                    <Form.Control
                        type="number"
                        value={dollars}
                        onChange={(e) => setDollars(Number(e.target.value) || undefined)}
                    />
                </Col>
                <Col>
                    <Form.Label>Cents</Form.Label>
                    <Form.Control
                        type="number"
                        value={cents}
                        onChange={(e) => setCents(Number(e.target.value) || undefined)}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PriceForm;
