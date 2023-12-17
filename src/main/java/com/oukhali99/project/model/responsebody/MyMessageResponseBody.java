package com.oukhali99.project.model.responsebody;

public class MyMessageResponseBody extends MyBaseResponseBody {

    private String message;

    public MyMessageResponseBody(String message) {
        this.message = message;
    }

    @Override
    public Object getBody() {
        return message;
    }
}
