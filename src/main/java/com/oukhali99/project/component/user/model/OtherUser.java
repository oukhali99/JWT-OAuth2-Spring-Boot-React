package com.oukhali99.project.component.user.model;

import com.oukhali99.project.component.user.User;
import lombok.Data;

public class OtherUser {

    private User user;

    private User selfUser;

    public OtherUser(User user, User selfUser) {
        this.user = user;
        this.selfUser = selfUser;
    }

    public boolean getIsAFriend() {
        return user.getFriends().contains(selfUser) || selfUser.getFriends().contains(user);
    }

    public boolean getSelfSentThisPersonAFriendRequest() {
        return user.getReceivedFriendRequests().contains(selfUser);
    }

    public boolean getThisPersonSentSelfAFriendRequest() {
        return selfUser.getReceivedFriendRequests().contains(user);
    }

    public User getUser() {
        return user;
    }

}
