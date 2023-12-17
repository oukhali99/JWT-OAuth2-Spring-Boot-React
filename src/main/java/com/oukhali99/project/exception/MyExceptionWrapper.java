package com.oukhali99.project.exception;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class MyExceptionWrapper extends MyException {

    private Exception innerException;

    @Override
    public String getMessage() {
        return innerException.getMessage();
    }
}
