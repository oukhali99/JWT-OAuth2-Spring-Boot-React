package com.oukhali99.project.component.user.model;

import com.oukhali99.project.component.user.User;

import java.util.LinkedList;
import java.util.List;

public class ObfuscatedUser {

    public ObfuscatedUser(User user) {
        this.user = user;
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

}
