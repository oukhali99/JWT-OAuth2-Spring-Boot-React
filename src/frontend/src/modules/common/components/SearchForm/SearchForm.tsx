import React from "react";
import { Form } from "react-bootstrap";

import { SearchQuery } from "modules/common";

interface Props {
    performQuery: (searchQuery: SearchQuery) => Promise<void>;
};

const SearchForm = ({ performQuery }: Props) => {
    const [searchQuery, setSearchQuery] = React.useState<SearchQuery>();

    return (
        <Form>
            Nothing here yet
        </Form>
    );
};

export default SearchForm;
