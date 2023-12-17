package com.oukhali99.project.model.responsebody;

public class MyMessageResponseBody extends MyResponseBody {

    private String message;

    public MyMessageResponseBody(ErrorCode errorCode, String message) {
        super(errorCode);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
