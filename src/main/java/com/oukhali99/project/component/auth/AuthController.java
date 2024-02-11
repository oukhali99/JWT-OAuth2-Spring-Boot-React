package com.oukhali99.project.component.auth;

import com.oukhali99.project.component.auth.exception.MyAuthenticationException;
import com.oukhali99.project.component.auth.model.responsebody.AuthResponse;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.apiresponse.ErrorCode;
import com.oukhali99.project.model.apiresponse.ApiMessageResponse;
import com.oukhali99.project.model.apiresponse.BaseApiResponse;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<BaseApiResponse> home() {
        BaseApiResponse responseBody = new ApiMessageResponse(ErrorCode.SUCCESS, "Nothing to see here");
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<BaseApiResponse> authenticate(
            @RequestParam String username,
            @RequestParam String password
    ) throws UsernameNotFoundException, MyAuthenticationException {
        BaseApiResponse baseApiResponse = new AuthResponse(
                authService.authenticate(username, password),
                userService.getByEmail(username)
        );

        return ResponseEntity.ok(baseApiResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<BaseApiResponse> register(
            @RequestParam String username,
            @RequestParam String password
    ) throws UserWithThatEmailAlreadyExists, UsernameNotFoundException {
        BaseApiResponse baseApiResponse = new AuthResponse(
                authService.register(username, password),
                userService.getByEmail(username)
        );

        return ResponseEntity.ok(baseApiResponse);
    }

}
