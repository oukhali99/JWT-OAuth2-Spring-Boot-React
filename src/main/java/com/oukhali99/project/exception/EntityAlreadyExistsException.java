package com.oukhali99.project.exception;

public class EntityAlreadyExistsException extends MyException {
    @Override
    public String getMessage() {
        return "Entity already exists";
    }
}
