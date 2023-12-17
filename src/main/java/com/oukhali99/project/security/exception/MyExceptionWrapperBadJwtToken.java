package com.oukhali99.project.security.exception;

import com.oukhali99.project.exception.MyExceptionWrapper;
import com.oukhali99.project.model.responsebody.ErrorCode;

public class MyExceptionWrapperBadJwtToken extends MyExceptionWrapper {

    public MyExceptionWrapperBadJwtToken(Exception innerException) {
        super(innerException);
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.BAD_JWT_TOKEN;
    }

}
