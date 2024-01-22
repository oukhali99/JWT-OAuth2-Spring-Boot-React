package com.oukhali99.project.component.user.model.responsebody;

import com.oukhali99.project.component.user.model.ObfuscatedSelf;
import com.oukhali99.project.model.apiresponse.ErrorCode;
import com.oukhali99.project.model.apiresponse.BaseApiResponse;

public class ObfuscatedSelfResponse extends BaseApiResponse {

    private ObfuscatedSelf obfuscatedSelf;

    public ObfuscatedSelfResponse(ObfuscatedSelf obfuscatedSelf) {
        this.obfuscatedSelf = obfuscatedSelf;
    }

    @Override
    public Object getContent() {
        return obfuscatedSelf;
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.SUCCESS;
    }
}
