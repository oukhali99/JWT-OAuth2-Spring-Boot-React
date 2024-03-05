package com.oukhali99.project.component.user.exception;

import com.oukhali99.project.exception.MyException;

public class TriedToAddYourselfException extends MyException {
    @Override
    public String getMessage() {
        return "You cannot send a friend request to yourself";
    }
}
