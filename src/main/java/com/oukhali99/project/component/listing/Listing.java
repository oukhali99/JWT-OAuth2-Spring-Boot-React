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

    @ManyToOne
    private User owner;

    private String title;

    @Embedded
    private Price price;

    public Listing(User owner) {
        this.owner = owner;
    }

    public Listing(User owner, String title, Price price) {
        this(owner);
        this.title = title;
        this.price = price;
    }

    public String getPriceHumanReadable() {
        return price.toString();
    }

}
