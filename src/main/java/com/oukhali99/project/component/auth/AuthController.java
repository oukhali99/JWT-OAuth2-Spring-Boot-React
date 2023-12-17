package com.oukhali99.project.component.auth;

import com.oukhali99.project.component.auth.exception.MyAuthenticationException;
import com.oukhali99.project.component.auth.model.responsebody.AuthResponseBody;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.model.responsebody.ErrorCode;
import com.oukhali99.project.model.responsebody.MyMessageResponseBody;
import com.oukhali99.project.model.responsebody.MyResponseBody;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

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
    public ResponseEntity<MyResponseBody> home() {
        MyResponseBody responseBody = new MyMessageResponseBody(ErrorCode.SUCCESS, "Nothing to see here");
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<MyResponseBody> authenticate(
            @RequestParam String username,
            @RequestParam String password
    ) throws UsernameNotFoundException, MyAuthenticationException {
        MyResponseBody myResponseBody = new AuthResponseBody(
                ErrorCode.SUCCESS,
                "Authentication successful",
                authService.authenticate(username, password),
                username
        );

        return ResponseEntity.ok(myResponseBody);
    }

    @PostMapping("/register")
    public ResponseEntity<MyResponseBody> register(
            @RequestParam String username,
            @RequestParam String password
    ) throws UserWithThatEmailAlreadyExists {
        MyResponseBody myResponseBody = new AuthResponseBody(
                ErrorCode.SUCCESS,
                "Registration successful",
                authService.register(username, password),
                username
        );

        return ResponseEntity.ok(myResponseBody);
    }

}
