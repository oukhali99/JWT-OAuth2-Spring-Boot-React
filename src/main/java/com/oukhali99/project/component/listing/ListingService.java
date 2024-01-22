package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.exception.EntityAlreadyExistsException;
import com.oukhali99.project.exception.EntityDoesNotExistException;
import com.oukhali99.project.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    public Listing getById(Long listingId) throws EntityDoesNotExistException {
        Optional<Listing> listingOptional = listingRepository.findById(listingId);
        if (listingOptional.isEmpty()) {
            throw new EntityDoesNotExistException();
        }

        return listingOptional.get();
    }

    public Listing getById(String ownerUsername, long id) throws EntityDoesNotExistException {
        return getById(id);
    }

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

    @Transactional
    private void addBid(Long listingId, Bid bid) throws EntityDoesNotExistException {
        getById(listingId).addBid(bid);
    }

    @Transactional
    public void addBid(Listing listing, Bid bid) throws EntityDoesNotExistException {
        addBid(listing.getId(), bid);
    }

}
