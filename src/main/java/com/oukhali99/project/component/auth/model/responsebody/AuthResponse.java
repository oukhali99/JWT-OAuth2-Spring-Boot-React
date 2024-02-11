package com.oukhali99.project.component.auth.model.responsebody;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.model.apiresponse.ApiObjectResponse;
import com.oukhali99.project.model.apiresponse.ErrorCode;
import com.oukhali99.project.model.apiresponse.ApiMessageResponse;

public class AuthResponse extends ApiObjectResponse {

    private String token;

    public AuthResponse(String token, User user) {
        super(user);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

}
