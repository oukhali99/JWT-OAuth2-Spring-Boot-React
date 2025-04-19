import { SearchQuery, StringSearchQuery } from "modules/common";

export interface UserSearchQuery extends SearchQuery {
    firstNameSearchQuery?: StringSearchQuery;
    lastNameSearchQuery?: StringSearchQuery;
    emailSearchQuery?: StringSearchQuery;
};
