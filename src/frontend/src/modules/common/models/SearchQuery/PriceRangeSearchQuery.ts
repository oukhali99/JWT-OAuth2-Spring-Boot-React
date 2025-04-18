import { Price } from "../Price";
import { SearchQuery } from "./SearchQuery";

export interface PriceRangeSearchQuery extends SearchQuery {
    min?: Price;
    max?: Price;
};
