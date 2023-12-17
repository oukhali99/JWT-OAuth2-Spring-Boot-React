package com.oukhali99.project.component.auth;

import com.oukhali99.project.component.auth.exception.MyAuthenticationException;
import com.oukhali99.project.component.auth.model.AuthResponse;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.security.JwtService;
import jakarta.annotation.Nonnull;
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
    public ResponseEntity<String> home() {
        return ResponseEntity.of(Optional.of("Hi"));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestParam String username,
            @RequestParam String password
    ) throws UsernameNotFoundException, MyAuthenticationException {
        AuthResponse authResponse = AuthResponse
                .builder()
                .token(authService.authenticate(username, password))
                .username(username)
                .build()
                ;

        return ResponseEntity.of(Optional.of(authResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestParam String username,
            @RequestParam String password
    ) throws UserWithThatEmailAlreadyExists {
        AuthResponse authResponse = AuthResponse
                .builder()
                .token(authService.register(username, password))
                .username(username)
                .build()
                ;

        return ResponseEntity.of(Optional.of(authResponse));
    }

    @PostMapping("/is-token-valid")
    public ResponseEntity<Map<String, Object>> isTokenValid(
            @RequestParam String username,
            @RequestParam String token
    ) throws UsernameNotFoundException {
        User user = userService.findByEmail(username);
        boolean isValid = jwtService.isTokenValid(token, user);
        return ResponseEntity.ok(Map.of("isTokenValid", isValid));
    }


}
