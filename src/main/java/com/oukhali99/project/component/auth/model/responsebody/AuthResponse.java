package com.oukhali99.project.component.auth.model.responsebody;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.model.apiresponse.ApiObjectResponse;
import lombok.Builder;
import lombok.Data;

public class AuthResponse extends ApiObjectResponse {

    public AuthResponse(String token, User user) {
        super(UserAndToken.builder().token(token).user(user).build());
    }

    @Data
    @Builder
    private static class UserAndToken {
        private String token;
        private User user;
    }

}
