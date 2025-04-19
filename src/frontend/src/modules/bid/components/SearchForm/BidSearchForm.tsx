import { useState } from "react";

import { BidSearchQuery } from "modules/bid/models/SearchQuery/BidSearchQuery";
import { PriceRangeSearchForm, PriceRangeSearchQuery } from "modules/common";

interface Props {
    bidSearchQuery?: BidSearchQuery;
    setBidSearchQuery: (bidSearchQuery?: BidSearchQuery) => void;
}

const BidSearchForm = ({ bidSearchQuery, setBidSearchQuery }: Props) => {
    return (
        <div>
            <PriceRangeSearchForm priceRangeSearchQuery={bidSearchQuery?.priceRangeSearchQuery} setPriceRangeSearchQuery={priceRangeSearchQuery => setBidSearchQuery({ priceRangeSearchQuery })} />
        </div>
    );
};

export default BidSearchForm;
