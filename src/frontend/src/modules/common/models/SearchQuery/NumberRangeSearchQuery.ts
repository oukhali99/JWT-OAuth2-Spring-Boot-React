import { SearchQuery } from "./SearchQuery";

export interface NumberSearchQuery extends SearchQuery {
    min?: number;
    max?: number;
}
