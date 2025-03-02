package com.oukhali99.project.exception;

public class MyMessageException extends MyException {
    private String message;

    public MyMessageException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
