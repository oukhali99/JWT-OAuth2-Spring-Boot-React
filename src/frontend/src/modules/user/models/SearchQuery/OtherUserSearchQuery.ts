import { BooleanSearchQuery, SearchQuery } from "modules/common";
import { UserSearchQuery } from "modules/user";

export interface OtherUserSearchQuery extends SearchQuery {
    userSearchQuery?: UserSearchQuery;
    isAFriendSearchQuery?: BooleanSearchQuery;
    selfSentThisPersonAFriendRequestSearchQuery?: BooleanSearchQuery;
    thisPersonSentSelfAFriendRequestSearchQuery?: BooleanSearchQuery;
};
