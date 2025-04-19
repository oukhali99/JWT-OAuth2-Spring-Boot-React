import { NumberSearchQuery, PriceRangeSearchQuery, SearchQuery } from "modules/common";

export interface BidSearchQuery extends SearchQuery {
    priceRangeSearchQuery?: PriceRangeSearchQuery;
    listingIdRangeSearchQuery?: NumberSearchQuery
};
