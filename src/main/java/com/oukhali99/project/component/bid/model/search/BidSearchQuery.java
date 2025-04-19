package com.oukhali99.project.component.bid.model.search;

import com.oukhali99.project.component.bid.Bid;
import com.oukhali99.project.model.Price;
import com.oukhali99.project.model.search.RangeSearchQuery;
import com.oukhali99.project.model.search.SearchQuery;
import lombok.Data;

@Data
public class BidSearchQuery implements SearchQuery<Bid> {
    private RangeSearchQuery<Price> priceRangeSearchQuery;
    private RangeSearchQuery<Long> listingIdRangeSearchQuery;

    @Override
    public boolean match(Bid entity) {
        if (priceRangeSearchQuery != null && !priceRangeSearchQuery.match(entity.getPrice())) return false;
        if (listingIdRangeSearchQuery != null && !listingIdRangeSearchQuery.match(entity.getListing().getId())) return false;

        return true;
    }
}
