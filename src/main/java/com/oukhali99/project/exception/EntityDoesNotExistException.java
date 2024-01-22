package com.oukhali99.project.exception;

public class EntityDoesNotExistException extends MyException {
    @Override
    public String getMessage() {
        return "Entity does not exist";
    }
}
