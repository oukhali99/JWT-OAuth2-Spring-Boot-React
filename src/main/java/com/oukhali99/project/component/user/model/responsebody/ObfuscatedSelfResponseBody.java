package com.oukhali99.project.component.user.model.responsebody;

import com.oukhali99.project.component.user.model.ObfuscatedSelf;
import com.oukhali99.project.model.responsebody.ErrorCode;
import com.oukhali99.project.model.responsebody.MyResponseBody;

public class ObfuscatedSelfResponseBody extends MyResponseBody {

    private ObfuscatedSelf obfuscatedSelf;

    public ObfuscatedSelfResponseBody(ObfuscatedSelf obfuscatedSelf) {
        super(ErrorCode.SUCCESS);
        this.obfuscatedSelf = obfuscatedSelf;
    }

    public ObfuscatedSelf getObfuscatedSelf() {
        return obfuscatedSelf;
    }

}
