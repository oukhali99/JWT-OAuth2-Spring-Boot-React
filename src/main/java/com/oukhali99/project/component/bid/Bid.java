package com.oukhali99.project.component.bid;

import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.model.Price;
import jakarta.persistence.*;

@Entity
@IdClass(BidId.class)
public class Bid {

    @Id
    private Long id;

    @Id
    @ManyToOne
    private Listing listing;

    @Embedded
    private Price price;

}
