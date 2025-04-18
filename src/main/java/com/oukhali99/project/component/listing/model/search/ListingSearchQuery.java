package com.oukhali99.project.component.listing.model.search;

import com.oukhali99.project.component.listing.Listing;
import com.oukhali99.project.model.Price;
import com.oukhali99.project.model.search.SearchQuery;
import com.oukhali99.project.model.search.RangeSearchQuery;
import com.oukhali99.project.model.search.StringSearchQuery;
import lombok.Data;

@Data
public class ListingSearchQuery implements SearchQuery<Listing> {
    private RangeSearchQuery<Price> priceRangeSearchQuery;

    private StringSearchQuery titleSearchQuery;

    @Override
    public boolean match(Listing entity) {
        if (priceRangeSearchQuery != null && !priceRangeSearchQuery.match(entity.getPrice())) return false;
        if (titleSearchQuery != null && !titleSearchQuery.match(entity.getTitle())) return false;

        return true;
    }
}
