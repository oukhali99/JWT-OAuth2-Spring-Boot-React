package com.oukhali99.project.component.listing;

import com.oukhali99.project.exception.MyException;
import com.oukhali99.project.model.apiresponse.ApiListResponse;
import com.oukhali99.project.model.apiresponse.ApiObjectResponse;
import com.oukhali99.project.model.apiresponse.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/listing")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @GetMapping
    public ResponseEntity<ApiResponse> findAll() {
        return ResponseEntity.ok(new ApiListResponse(listingService.findAll()));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> create(
            @RequestHeader(name = "Authorization") String authorization
    ) throws MyException {
        return ResponseEntity.ok(new ApiObjectResponse(listingService.create(authorization)));
    }

}
