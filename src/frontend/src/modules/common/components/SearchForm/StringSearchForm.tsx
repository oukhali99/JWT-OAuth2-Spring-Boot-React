import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { StringSearchQuery } from "modules/common";

interface Props {
    setStringSearchQuery: (searchStringQuery?: StringSearchQuery) => void;
};

const StringSearchForm = ({ setStringSearchQuery }: Props) => {
    const [searchString, setSearchString] = useState<string>();

    useEffect(() => {
        if (!searchString) {
            setStringSearchQuery(undefined);
            return;
        }
        setStringSearchQuery({ searchString });
    }, [searchString]);

    return (
        <div>
            <Form.Group className="mb-3" controlId="searchString">
                <Form.Label>Search</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter search string"
                    value={searchString}
                    onChange={(e) => {
                        setSearchString(e.target.value);
                    }}
                />
            </Form.Group>
        </div>
    );
};

export default StringSearchForm;
