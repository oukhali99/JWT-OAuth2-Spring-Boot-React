import { SearchQuery } from "./SearchQuery";

export interface BooleanSearchQuery extends SearchQuery {
    value?: boolean;
};
