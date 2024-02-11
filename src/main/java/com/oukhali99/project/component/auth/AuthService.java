package com.oukhali99.project.component.auth;

import com.oukhali99.project.component.auth.exception.MyAuthenticationException;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public String authenticate(String username, String password) throws MyAuthenticationException, UsernameNotFoundException {
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
        return jwtService.generateToken(user);
    }

    public String register(String username, String password) throws UserWithThatEmailAlreadyExists {
        User user = User.builder()
                .email(username)
                .passwordHash(passwordEncoder.encode(password))
                .build()
                ;

        // Make him a user
        user.addAuthorityString("USER");

        userService.addUser(user);
        String jwtToken = jwtService.generateToken(user);

        return jwtToken;
    }
}
