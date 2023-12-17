package com.oukhali99.project.component.auth.model.responsebody;

import com.oukhali99.project.model.responsebody.ErrorCode;
import com.oukhali99.project.model.responsebody.MyMessageResponseBody;

public class AuthResponseBody extends MyMessageResponseBody {

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }

    private String username;

    private String token;

    public AuthResponseBody(ErrorCode errorCode, String message, String token, String username) {
        super(errorCode, message);
        this.username = username;
        this.token = token;
    }

}
