package com.oukhali99.project.component.user.model;

import com.oukhali99.project.component.user.User;

import java.util.LinkedList;
import java.util.List;

public class ObfuscatedUser {

    private String friendUsername;

    public ObfuscatedUser(User user) {
        this.user = user;
        this.friendUsername = null;
    }

    public ObfuscatedUser(User user, String friendUsername) {
        this.user = user;
        this.friendUsername = friendUsername;
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

    public Boolean getSelfSendThisPersonAFriendRequest() {
        if (friendUsername == null) {
            return false;
        }

        for (User user : user.getReceivedFriendRequests()) {
            if (user.getEmail().equals(friendUsername)) {
                return true;
            }
        }

        return false;
    }

}
