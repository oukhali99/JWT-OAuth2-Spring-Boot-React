package com.oukhali99.project.component.bid;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.model.Price;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity
@NoArgsConstructor
@Data
public class Bid {

    @Id
    @GeneratedValue
    private Long id;

    @JsonIgnore
    @ManyToOne
    private Listing listing;

    @Embedded
    private Price price;

    public Bid(Listing listing, Price price) {
        this.listing = listing;
        this.price = price;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Bid bid = (Bid) o;
        return id.equals(bid.id) && listing.equals(bid.listing);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, listing);
    }
}
