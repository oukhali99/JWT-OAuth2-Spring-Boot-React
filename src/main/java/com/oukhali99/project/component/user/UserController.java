package com.oukhali99.project.component.user;

import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.component.listing.ListingService;
import com.oukhali99.project.component.user.model.ObfuscatedSelf;
import com.oukhali99.project.component.user.model.responsebody.ObfuscatedSelfResponse;
import com.oukhali99.project.component.user.model.responsebody.ObfuscatedUserListResponse;
import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.Price;
import com.oukhali99.project.model.apiresponse.*;
import com.oukhali99.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ListingService listingService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/get-all")
    public ResponseEntity<BaseApiResponse> home() throws MyException {
        List<User> userList = userService.findAll();
        ObfuscatedUserListResponse obfuscatedUserListResponseBody = new ObfuscatedUserListResponse(
                "Successfully retrieved user list",
                userList
        );

        return ResponseEntity.ok(obfuscatedUserListResponseBody);
    }

    @PostMapping("/add-authority")
    public ResponseEntity<BaseApiResponse> makeAdmin(
            @RequestParam String username,
            @RequestParam String authority
    ) throws MyException {
        userService.addAuthority(username, authority);
        return ResponseEntity.ok(
                new ApiMessageResponse(ErrorCode.SUCCESS, "Successfully made " + username + " a " + authority)
        );
    }

    @PostMapping("/add-friend")
    public ResponseEntity<BaseApiResponse> addFriend(
            @RequestParam String username,
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        String jwtToken = authorization.substring(7);
        String myUsername = jwtService.extractUsername(jwtToken);

        userService.addFriend(myUsername, username);

        return ResponseEntity.ok(new ApiMessageResponse(ErrorCode.SUCCESS, "Successfully added " + username));
    }

    @PostMapping("/remove-friend")
    public ResponseEntity<BaseApiResponse> removeFriend(
            @RequestParam String username,
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        String jwtToken = authorization.substring(7);
        String myUsername = jwtService.extractUsername(jwtToken);

        userService.removeFriend(myUsername, username);

        return ResponseEntity.ok(new ApiMessageResponse(ErrorCode.SUCCESS, "Successfully removed " + username));
    }

    @PostMapping("/get-self")
    public ResponseEntity<BaseApiResponse> getSelf(
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        String jwtToken = authorization.substring(7);
        String myUsername = jwtService.extractUsername(jwtToken);

        ObfuscatedSelf obfuscatedSelf = new ObfuscatedSelf(userService.findByEmail(myUsername));
        return ResponseEntity.ok(new ObfuscatedSelfResponse(obfuscatedSelf));
    }

    @PostMapping("/create-listing")
    public ResponseEntity<ApiResponse> createListing(
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam String title,
            @RequestParam long priceDollars
    ) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        User owner = userService.findByEmail(username);
        return ResponseEntity.ok(new ApiObjectResponse(
                        userService.addListing(new Listing(owner, title, new Price(priceDollars)))
                )
        );
    }

    @PostMapping("/create-bid")
    public ResponseEntity<ApiResponse> createBid(
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam long listingId,
            @RequestParam long priceDollars
    ) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        User owner = userService.findByEmail(username);
        Listing listing = listingService.getById(listingId);

        Bid bid = new Bid(owner, listing, new Price(priceDollars));
        listingService.addBid(bid);
        owner = userService.addBid(bid);

        return ResponseEntity.ok(new ApiObjectResponse(owner));
    }

}
