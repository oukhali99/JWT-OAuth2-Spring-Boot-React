package com.oukhali99.project.component.user;

import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.component.user.model.ObfuscatedSelf;
import com.oukhali99.project.component.user.model.responsebody.ObfuscatedSelfResponseBody;
import com.oukhali99.project.component.user.model.responsebody.ObfuscatedUserListResponseBody;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.responsebody.ErrorCode;
import com.oukhali99.project.model.responsebody.MyMessageResponseBody;
import com.oukhali99.project.model.responsebody.MyResponseBody;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("")
    public ResponseEntity<MyResponseBody> home() {
        List<User> userList = userService.findAll();
        ObfuscatedUserListResponseBody obfuscatedUserListResponseBody = new ObfuscatedUserListResponseBody(
                "Successfully retrieved user list",
                userList
        );
        return ResponseEntity.ok(obfuscatedUserListResponseBody);
    }

    @PostMapping("/add-authority")
    public ResponseEntity<MyResponseBody> makeAdmin(
            @RequestParam String username,
            @RequestParam String authority
    ) throws MyException {
        userService.addAuthority(username, authority);
        return ResponseEntity.ok(
                new MyMessageResponseBody(ErrorCode.SUCCESS, "Successfully made " + username + " a " + authority)
        );
    }

    @PostMapping("/add-friend")
    public ResponseEntity<MyResponseBody> addFriend(
            @RequestParam String username,
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        String jwtToken = authorization.substring(7);
        String myUsername = jwtService.extractUsername(jwtToken);

        userService.addFriend(myUsername, username);

        return ResponseEntity.ok(new MyMessageResponseBody(ErrorCode.SUCCESS, "Successfully added " + username));
    }

    @PostMapping("/remove-friend")
    public ResponseEntity<MyResponseBody> removeFriend(
            @RequestParam String username,
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        String jwtToken = authorization.substring(7);
        String myUsername = jwtService.extractUsername(jwtToken);

        userService.removeFriend(myUsername, username);

        return ResponseEntity.ok(new MyMessageResponseBody(ErrorCode.SUCCESS, "Successfully removed " + username));
    }

    @PostMapping("/get-self")
    public ResponseEntity<MyResponseBody> getSelf(
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        String jwtToken = authorization.substring(7);
        String myUsername = jwtService.extractUsername(jwtToken);

        ObfuscatedSelf obfuscatedSelf = new ObfuscatedSelf(userService.findByEmail(myUsername));
        return ResponseEntity.ok(new ObfuscatedSelfResponseBody(obfuscatedSelf));
    }

}
