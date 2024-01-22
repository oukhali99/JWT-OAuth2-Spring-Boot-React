package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.model.Price;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@IdClass(ListingId.class)
@Data
@NoArgsConstructor
public class Listing {

    @Id
    private String ownerUsername;

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private Price price;

    @OneToMany
    private List<Bid> bids;

    public ListingId getId() {
        return new ListingId(ownerUsername, id);
    }

    public Listing(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public Listing(String ownerUsername, String title, Price price) {
        this(ownerUsername);
        this.title = title;
        this.price = price;
    }

    public void addBid(Bid bid) {
        bids.add(bid);
    }

}
