package com.oukhali99.project.component.user;

import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.component.user.model.responsebody.ObfuscatedUserListResponseBody;
import com.oukhali99.project.model.responsebody.ErrorCode;
import com.oukhali99.project.model.responsebody.MyMessageResponseBody;
import com.oukhali99.project.model.responsebody.MyResponseBody;
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

    @PostMapping("")
    public ResponseEntity<ObfuscatedUserListResponseBody> home() {
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
    ) throws UsernameNotFoundException {
        userService.addAuthority(username, authority);
        return ResponseEntity.ok(
                new MyMessageResponseBody(ErrorCode.SUCCESS, "Successfully made " + username + " a " + authority)
        );
    }

}
