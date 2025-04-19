import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { StringSearchQuery } from "modules/common";

interface Props {
    stringSearchQuery?: StringSearchQuery;
    setStringSearchQuery: (searchStringQuery?: StringSearchQuery) => void;
    name?: string;
};

const StringSearchForm = ({ stringSearchQuery, setStringSearchQuery, name }: Props) => {
    const [searchString, setSearchString] = useState(stringSearchQuery?.searchString);

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
                <Form.Control
                    type="text"
                    placeholder={name}
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
