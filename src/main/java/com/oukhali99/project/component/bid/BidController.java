package com.oukhali99.project.component.bid;

import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.component.listing.ListingService;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.component.user.UserService;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.Price;
import com.oukhali99.project.model.apiresponse.ApiObjectResponse;
import com.oukhali99.project.model.apiresponse.ApiResponse;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bid")
public class BidController {

    @Autowired
    private UserService userService;

    @Autowired
    private ListingService listingService;

    @Autowired
    private JwtService jwtService;

    @PutMapping
    public ResponseEntity<ApiResponse> putBid(
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam long listingId,
            @RequestParam long priceDollars
    ) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        User owner = userService.getByEmail(username);
        Listing listing = listingService.getById(listingId);

        Bid bid = new Bid(owner, listing, new Price(priceDollars));
        listingService.addBid(bid);
        owner = userService.addBid(bid);

        return ResponseEntity.ok(new ApiObjectResponse(owner));
    }

}
