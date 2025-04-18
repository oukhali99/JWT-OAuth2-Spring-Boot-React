import { PriceRangeSearchQuery, SearchQuery, StringSearchQuery } from "modules/common";

export interface ListingSearchQuery extends SearchQuery {
    priceRangeSearchQuery?: PriceRangeSearchQuery;
    titleSearchQuery?: StringSearchQuery
};
