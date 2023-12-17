package com.oukhali99.project.component.user;

import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.model.responsebody.MyMessageResponseBody;
import com.oukhali99.project.model.responsebody.MyResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<User>> home() {
        return ResponseEntity.of(Optional.ofNullable(userService.findAll()));
    }

    @GetMapping("/add-authority")
    public ResponseEntity<MyResponseBody> makeAdmin(
            @RequestParam String username,
            @RequestParam String authority
    ) throws UsernameNotFoundException {
        userService.addAuthority(username, authority);
        return ResponseEntity.ok(new MyMessageResponseBody("Successfully made " + username + " a " + authority));
    }

}
