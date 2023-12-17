package com.oukhali99.project.component.user.model;

import com.oukhali99.project.component.user.User;

import java.util.List;

public class ObfuscatedSelf extends ObfuscatedUser {
    public ObfuscatedSelf(User user) {
        super(user);
    }

    public List<String> getReceivedFriendRequestUsernameList() {
        return user.getReceivedFriendRequests().stream().map(user -> user.getUsername()).toList();
    }

}
