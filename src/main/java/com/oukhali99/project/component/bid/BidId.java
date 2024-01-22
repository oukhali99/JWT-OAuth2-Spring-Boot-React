package com.oukhali99.project.component.bid;

import com.oukhali99.project.component.listing.Listing;

import java.io.Serializable;

public class BidId implements Serializable {

    private Long id;

    private Listing listing;

    public BidId(Long id, Listing listing) {
        this.id = id;
        this.listing = listing;
    }

}
