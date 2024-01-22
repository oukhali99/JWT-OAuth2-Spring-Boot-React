package com.oukhali99.project.model.apiresponse;

import com.oukhali99.project.exception.MyException;

public class ApiExceptionResponse extends BaseApiResponse {

    private MyException myException;

    public ApiExceptionResponse(MyException myException) {
        this.myException = myException;
    }

    @Override
    public Object getContent() {
        return myException.getMessage();
    }

    @Override
    public ErrorCode getErrorCode() {
        return myException.getErrorCode();
    }
}
