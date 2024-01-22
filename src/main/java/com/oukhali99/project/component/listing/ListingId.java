package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.user.User;

import java.io.Serializable;

public class ListingId implements Serializable {

    private User owner;

    private Long id;

    public ListingId(User owner, Long id) {
        this.owner = owner;
        this.id = id;
    }
}
