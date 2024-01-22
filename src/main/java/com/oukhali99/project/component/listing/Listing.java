package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.model.Price;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@IdClass(ListingId.class)
@Data
public class Listing {

    @Id
    @ManyToOne
    private User owner;

    @Id
    private Long id;

    private String title;

    private Price price;

    public ListingId getId() {
        return new ListingId(owner, id);
    }

}
