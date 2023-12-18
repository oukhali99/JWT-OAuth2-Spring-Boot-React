package com.oukhali99.project.component.user.model;

import com.oukhali99.project.component.user.User;

import java.util.LinkedList;
import java.util.List;

public class ObfuscatedUser {

    private User selfUser;

    public ObfuscatedUser(User user) {
        this.user = user;
    }

    public ObfuscatedUser(User user, User selfUser) {
        this.user = user;
        this.selfUser = selfUser;
    }

    protected User user;

    public String getFirstName() {
        return user.getFirstName();
    }

    public String getLastName() {
        return user.getLastName();
    }

    public Long getId() {
        return user.getId();
    }

    public String getUsername() {
        return user.getUsername();
    }

    public List<String> getAuthorityStringList() {
        return user.getAuthorityStringList();
    }

    public List<String> getFriendUsernameList() {
        List<String> friendUsernameList = new LinkedList<>();
        for (User friend : user.getFriends()) {
            friendUsernameList.add(friend.getUsername());
        }
        return friendUsernameList;
    }

    public Boolean getSelfSentThisPersonAFriendRequest() {
        if (selfUser == null) {
            return false;
        }

        return user.getReceivedFriendRequests().contains(selfUser);
    }

    public Boolean getThisPersonSentSelfAFriendRequest() {
        if (selfUser == null) {
            return false;
        }

        return selfUser.getReceivedFriendRequests().contains(user);
    }

}
