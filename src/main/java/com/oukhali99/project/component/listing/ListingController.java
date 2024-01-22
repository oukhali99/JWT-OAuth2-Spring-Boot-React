package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.user.User;
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

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiListResponse(listingService.findAll()));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> create(
            @RequestHeader(name = "Authorization") String authorization,
            @RequestParam String title,
            @RequestParam long priceDollars
    ) throws MyException {
        String username = jwtService.extractUsernameFromAuthorizationHeader(authorization);
        return ResponseEntity.ok(new ApiObjectResponse(
                listingService.save(
                        new Listing(username, title, new Price(priceDollars)))
                )
        );
    }

    @PostMapping("/bid")
    public ResponseEntity<ApiResponse> bid(
        @RequestHeader(name = "Authorization") String authorization,
        @RequestParam String ownerUsername,
        @RequestParam long id
    ) {
        return null;
    }

}
