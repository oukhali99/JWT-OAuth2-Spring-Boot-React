package com.oukhali99.project.component.user;

import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
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

    public User findByEmail(String email) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException(email);
        }

        return userOptional.orElseThrow();
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
        }
        catch (UsernameNotFoundException e) {
            throw new org.springframework.security.core.userdetails.UsernameNotFoundException(username + " not found");
        }
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public void addAuthority(String username, String authorityString) throws UsernameNotFoundException {
        findByEmail(username).addAuthorityString(authorityString);
    }

}
