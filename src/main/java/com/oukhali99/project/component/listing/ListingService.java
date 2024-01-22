package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.exception.EntityAlreadyExistsException;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.apiresponse.ApiResponse;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    public List<Listing> findAll() {
        return listingRepository.findAll();
    }

    public Listing save(Listing listing) throws EntityAlreadyExistsException {
        if (listingRepository.findById(listing.getId()).isPresent()) {
            throw new EntityAlreadyExistsException();
        }

        listingRepository.save(listing);
        return listing;
    }

    public Listing create(String authorization) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        User user = userService.findByEmail(username);
        return save(new Listing(user));
    }

}
