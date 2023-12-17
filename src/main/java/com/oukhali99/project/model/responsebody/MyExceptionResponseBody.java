package com.oukhali99.project.model.responsebody;

import com.oukhali99.project.exception.MyException;

public class MyExceptionResponseBody extends MyResponseBody {

    private MyException myException;

    public MyExceptionResponseBody(MyException myException) {
        super(myException.getErrorCode());
        this.myException = myException;
    }

    public String getMessage() {
        return myException.getMessage();
    }

}
