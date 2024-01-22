package com.oukhali99.project.model.apiresponse;

import java.util.List;

public class ApiListResponse extends BaseApiResponse {

    private List list;

    public ApiListResponse(List list) {
        this.list = list;
    }

    @Override
    public Object getContent() {
        return list;
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.SUCCESS;
    }

    public long getSize() {
        if (list == null) {
            return 0;
        }

        return list.size();
    }

}
