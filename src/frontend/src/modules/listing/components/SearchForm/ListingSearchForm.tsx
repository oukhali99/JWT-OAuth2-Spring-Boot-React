import { useState, useEffect } from "react";

import { PriceRangeSearchForm, StringSearchForm, PriceRangeSearchQuery, StringSearchQuery } from "modules/common";
import { ListingSearchQuery } from "modules/listing";

interface Props {
    listingSearchQuery?: ListingSearchQuery;
    setListingSearchQuery: (listingSearchQuery?: ListingSearchQuery) => void;
};

const ListingSearchForm = ({ listingSearchQuery, setListingSearchQuery }: Props) => {
    const [priceRangeSearchQuery, setPriceRangeSearchQuery] = useState(listingSearchQuery?.priceRangeSearchQuery);
    const [stringSearchQuery, setStringSearchQuery] = useState(listingSearchQuery?.titleSearchQuery);

    useEffect(() => {
        setListingSearchQuery({ priceRangeSearchQuery: priceRangeSearchQuery, titleSearchQuery: stringSearchQuery });
    }, [priceRangeSearchQuery, stringSearchQuery]);

    return (
        <div>
            <StringSearchForm stringSearchQuery={stringSearchQuery} setStringSearchQuery={setStringSearchQuery} />
            <PriceRangeSearchForm priceRangeSearchQuery={priceRangeSearchQuery} setPriceRangeSearchQuery={setPriceRangeSearchQuery} />
        </div>
    );
};

export default ListingSearchForm;
