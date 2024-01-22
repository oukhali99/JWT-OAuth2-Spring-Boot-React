package com.oukhali99.project.exception;

import com.oukhali99.project.model.apiresponse.ErrorCode;

public abstract class MyException extends Exception {

    @Override
    public abstract String getMessage();

    public ErrorCode getErrorCode() {
        return ErrorCode.NONSPECIFIC_ERROR;
    }

}
