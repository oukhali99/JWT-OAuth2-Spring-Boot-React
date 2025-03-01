package com.oukhali99.project.component.bid;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    @Query(value = "SELECT * FROM bid WHERE listing_id = :listingId", nativeQuery = true)
    public List<Bid> getBidsForListing(
            @Param("listingId") long listingId
    );

}
