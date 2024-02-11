package com.oukhali99.project.component.user;

import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.component.user.exception.UserWithThatEmailAlreadyExists;
import com.oukhali99.project.component.user.exception.UsernameNotFoundException;
import com.oukhali99.project.component.user.model.OtherUser;
import com.oukhali99.project.exception.EntityDoesNotExistException;
import com.oukhali99.project.exception.MyException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public User getById(long id) throws EntityDoesNotExistException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new EntityDoesNotExistException();
        }

        return userOptional.get();
    }

    public User getByEmail(String email) throws UsernameNotFoundException {
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
            return getByEmail(username);
        } catch (MyException e) {
            return null;
        }
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<OtherUser> findAllOtherUsers(String selfUsername) throws UsernameNotFoundException {
        User selfUser = getByEmail(selfUsername);
        List<User> users = findAll();

        List<OtherUser> otherUsers = new LinkedList<>();
        for (User user : users) {
            if (selfUser.equals(user)) {
                continue;
            }

            otherUsers.add(
                    new OtherUser(user, selfUser)
            );
        }

        return otherUsers;
    }

    @Transactional
    public void addAuthority(String username, String authorityString) throws MyException {
        getByEmail(username).addAuthorityString(authorityString);
    }

    @Transactional
    public void addFriend(String username, String otherUsername) throws MyException {
        User myUser = getByEmail(username);
        User otherUser = getByEmail(otherUsername);

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
        User myUser = getByEmail(username);
        User otherUser = getByEmail(otherUsername);

        myUser.removeFriend(otherUser);
        otherUser.removeFriend(myUser);
    }

    @Transactional
    public User addListing(Listing listing) throws EntityDoesNotExistException {
        User user = getById(listing.getOwner().getId());
        user.addListing(listing);
        return user;
    }

    @Transactional
    public User addBid(Bid bid) throws EntityDoesNotExistException {
        User bidder = getById(bid.getBidder().getId());
        bidder.addBid(bid);
        return bidder;
    }

}
