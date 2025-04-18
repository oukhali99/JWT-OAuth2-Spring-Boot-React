import { SearchQuery } from "./SearchQuery";

export interface StringSearchQuery extends SearchQuery {
    searchString: string;
}
