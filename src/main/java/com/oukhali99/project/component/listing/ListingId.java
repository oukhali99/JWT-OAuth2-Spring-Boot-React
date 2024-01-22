package com.oukhali99.project.component.listing;

import com.oukhali99.project.component.user.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
public class ListingId implements Serializable {

    private String ownerUsername;

    private Long id;

    public ListingId(String ownerUsername, Long id) {
        this.ownerUsername = ownerUsername;
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListingId listingId = (ListingId) o;
        return ownerUsername.equals(listingId.ownerUsername) && id.equals(listingId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ownerUsername, id);
    }

}
