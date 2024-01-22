package com.oukhali99.project.component.auth.model.responsebody;

import com.oukhali99.project.model.apiresponse.ErrorCode;
import com.oukhali99.project.model.apiresponse.ApiMessageResponse;

public class AuthResponse extends ApiMessageResponse {

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }

    private String username;

    private String token;

    public AuthResponse(ErrorCode errorCode, String message, String token, String username) {
        super(errorCode, message);
        this.username = username;
        this.token = token;
    }

}
