package com.oukhali99.project.exception;

import com.oukhali99.project.model.responsebody.ErrorCode;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public abstract class MyException extends Exception {

    @Override
    public abstract String getMessage();

    public ErrorCode getErrorCode() {
        return ErrorCode.NONSPECIFIC_ERROR;
    }

}
