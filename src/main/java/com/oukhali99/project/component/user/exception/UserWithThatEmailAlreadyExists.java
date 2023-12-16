package com.oukhali99.project.component.user.exception;

import com.oukhali99.project.exception.MyException;

public class UserWithThatEmailAlreadyExists extends MyException {

    public UserWithThatEmailAlreadyExists(String email) {
        this.email = email;
    }

    private String email;

    @Override
    public String getMessage() {
        return "User with the email " + email + " already exists";
    }
}
