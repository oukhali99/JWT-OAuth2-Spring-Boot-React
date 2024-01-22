package com.oukhali99.project.model.apiresponse;

public class ApiMessageResponse extends BaseApiResponse {

    private String message;

    private ErrorCode errorCode;

    public ApiMessageResponse(ErrorCode errorCode, String message) {
        this.message = message;
        this.errorCode = errorCode;
    }

    @Override
    public Object getContent() {
        return message;
    }

    @Override
    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
