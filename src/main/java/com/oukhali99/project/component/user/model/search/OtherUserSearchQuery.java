package com.oukhali99.project.component.user.model.search;

import com.oukhali99.project.component.user.model.OtherUser;
import com.oukhali99.project.model.search.BooleanSearchQuery;
import com.oukhali99.project.model.search.SearchQuery;
import lombok.Data;

@Data
public class OtherUserSearchQuery implements SearchQuery<OtherUser> {
    private UserSearchQuery userSearchQuery;
    private BooleanSearchQuery isAFriendSearchQuery;
    private BooleanSearchQuery selfSentThisPersonAFriendRequestSearchQuery;
    private BooleanSearchQuery thisPersonSentSelfAFriendRequestSearchQuery;

    @Override
    public boolean match(OtherUser entity) {
        if (userSearchQuery != null && !userSearchQuery.match(entity.getUser())) return false;
        if (isAFriendSearchQuery != null && !isAFriendSearchQuery.match(entity.getIsAFriend())) return false;
        if (selfSentThisPersonAFriendRequestSearchQuery != null && !selfSentThisPersonAFriendRequestSearchQuery.match(entity.getSelfSentThisPersonAFriendRequest())) return false;
        if (thisPersonSentSelfAFriendRequestSearchQuery != null && !thisPersonSentSelfAFriendRequestSearchQuery.match(entity.getThisPersonSentSelfAFriendRequest())) return false;

        return true;
    }
}
