package com.oukhali99.project.component.user.exception;

import com.oukhali99.project.exception.MyException;

public class UsernameNotFoundException extends MyException {

    private String username;

    public UsernameNotFoundException(String username) {
        this.username = username;
    }

    @Override
    public String getMessage() {
        return "Username " + username + " not found";
    }
}
