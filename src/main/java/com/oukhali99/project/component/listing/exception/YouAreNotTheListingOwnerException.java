package com.oukhali99.project.component.listing.exception;

import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.exception.MyException;

public class YouAreNotTheListingOwnerException extends MyException {
    private Listing listing;
    private String yourUsername;

    public YouAreNotTheListingOwnerException(Listing listing, String yourUsername) {
        this.listing = listing;
        this.yourUsername = yourUsername;
    }

    @Override
    public String getMessage() {
        return String.format("You are not the owner of the listing with id %d", listing.getId());
    }
}
