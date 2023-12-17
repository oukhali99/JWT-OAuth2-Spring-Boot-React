package com.oukhali99.project.component.user;

import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.exception.MyException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public User findByEmail(String email) throws MyException {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElseThrow(() -> new UsernameNotFoundException(email));
    }

    public void addUser(User user) throws UserWithThatEmailAlreadyExists {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserWithThatEmailAlreadyExists(user.getEmail());
        }

        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        try {
            return findByEmail(username);
        } catch (MyException e) {
            return null;
        }
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public void addAuthority(String username, String authorityString) throws MyException {
        findByEmail(username).addAuthorityString(authorityString);
    }

    @Transactional
    public void addFriend(String username, String otherUsername) throws MyException {
        User myUser = findByEmail(username);
        User otherUser = findByEmail(otherUsername);

        if (myUser.getReceivedFriendRequests().contains(otherUser)) {
            myUser.addFriend(otherUser);
            otherUser.addFriend(myUser);
        }
        else {
            otherUser.addReceivedFriendRequest(myUser);
        }
    }

    @Transactional
    public void removeFriend(String username, String otherUsername) throws MyException {
        User myUser = findByEmail(username);
        User otherUser = findByEmail(otherUsername);

        myUser.removeFriend(otherUser);
        otherUser.removeFriend(myUser);
    }

}
