package com.oukhali99.project.component.auth.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AuthResponse {

    private String username;

    private String token;

}
