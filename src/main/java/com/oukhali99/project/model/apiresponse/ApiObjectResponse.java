package com.oukhali99.project.model.apiresponse;

public class ApiObjectResponse extends BaseApiResponse {

    private Object object;

    public ApiObjectResponse(Object object) {
        this.object = object;
    }

    @Override
    public Object getContent() {
        return object;
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.SUCCESS;
    }
}
