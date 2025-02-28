package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.component.bid.BidService;
import com.oukhali99.project.component.listing.exception.YouAreNotTheListingOwnerException;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.Price;
import com.oukhali99.project.model.apiresponse.ApiListResponse;
import com.oukhali99.project.model.apiresponse.ApiObjectResponse;
import com.oukhali99.project.model.apiresponse.ApiResponse;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/listing")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private BidService bidService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiListResponse(listingService.findAll()));
    }

    @PostMapping("/bid")
    public ResponseEntity<ApiResponse> bid(
        @RequestHeader(name = "Authorization") String authorization,
        @RequestParam String ownerUsername,
        @RequestParam long listingId,
        @RequestParam long priceDollars
    ) throws MyException {
        Listing listing = listingService.getById(ownerUsername, listingId);
        User bidder = userService.getByEmail(jwtService.extractUsernameFromAuthorizationHeader(authorization));
        Bid bid = bidService.save(
                new Bid(bidder, listing, new Price(priceDollars))
        );
        return ResponseEntity.ok(new ApiObjectResponse(bid));
    }

    @PutMapping
    public ResponseEntity<ApiResponse> putListing(
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam String title,
            @RequestParam long priceDollars
    ) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        User owner = userService.getByEmail(username);
        return ResponseEntity.ok(new ApiObjectResponse(
                    listingService.addListing(new Listing(owner, title, new Price(priceDollars)))
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteListing(
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam long listingId
    ) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        Listing listing = listingService.getById(listingId);
        if (!listing.getOwner().getEmail().equals(username)) throw new YouAreNotTheListingOwnerException(listing, username);
        listingService.deleteListing(listing);
        return ResponseEntity.ok(new ApiObjectResponse("ok"));
    }

}
