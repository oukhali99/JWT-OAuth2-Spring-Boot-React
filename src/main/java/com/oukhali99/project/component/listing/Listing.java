package com.oukhali99.project.component.listing;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.component.user.User;
import com.oukhali99.project.model.Price;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Listing {

    @Id
    @GeneratedValue
    private Long id;

    @JsonIgnore
    @ManyToOne
    private User owner;

    private String title;

    @Embedded
    private Price price;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Bid> bids;

    public Listing(User owner) {
        this.owner = owner;
    }

    public Listing(User owner, String title, Price price) {
        this(owner);
        this.title = title;
        this.price = price;
    }

    public void addBid(Bid bid) {
        bids.add(bid);
    }

    public String getPriceHumanReadable() {
        return price.toString();
    }

}
