package com.oukhali99.project.component.bid;

import com.oukhali99.project.component.listing.Listing;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class BidId implements Serializable {

    private Long id;

    private Listing listing;

    public BidId(Long id, Listing listing) {
        this.id = id;
        this.listing = listing;
    }

}
