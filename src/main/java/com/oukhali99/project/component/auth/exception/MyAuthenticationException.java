package com.oukhali99.project.component.auth.exception;

import com.oukhali99.project.exception.MyException;

public class MyAuthenticationException extends MyException {
    @Override
    public String getMessage() {
        return "Authentication exception";
    }
}
