package com.oukhali99.project.component.auth;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.oukhali99.project.component.auth.exception.MyAuthenticationException;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.exception.MyMessageException;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthService {

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String authenticate(String username, String password) throws MyException {
        try {
            // The below line will throw an error if the username or password is wrong
            authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(
                    username,
                    password
            ));
        }
        catch (AuthenticationException e) {
            throw new MyAuthenticationException();
        }

        User user = userService.getByEmail(username);
        if (user.isSignedUpWithOAuth()) throw new MyMessageException("User signed up with OAuth");

        return jwtService.generateToken(user);
    }

    public String register(String username, String password, boolean signedUpWithOAuth) throws UserWithThatEmailAlreadyExists {
        User user = User.builder()
                .email(username)
                .passwordHash(passwordEncoder.encode(password))
                .signedUpWithOAuth(signedUpWithOAuth)
                .build()
                ;

        // Make him a user
        user.addAuthorityString("USER");

        userService.addUser(user);
        String jwtToken = jwtService.generateToken(user);

        return jwtToken;
    }

    public String register(String username, String password) throws UserWithThatEmailAlreadyExists {
        return register(username, password, false);
    }

    public User authenticateOrRegisterWithGoogle(String token) throws MyException {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(
                "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + token,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) throw new MyMessageException("Google token is invalid");

        String responseBody = response.getBody();
        if (responseBody == null) throw new MyMessageException("Google token is invalid");

        JsonObject jsonObject = JsonParser.parseString(responseBody).getAsJsonObject();
        if (!jsonObject.has("email")) throw new MyMessageException("Google token is invalid");

        String email = jsonObject.get("email").getAsString();

        User user;
        try {
            user = userService.getByEmail(email);
        }
        catch (UsernameNotFoundException e) {
            register(email, "", true);
            user = userService.getByEmail(email);
        }

        if (!user.isSignedUpWithOAuth()) throw new MyMessageException("User did not sign up with Google");

        return user;
    }
}
