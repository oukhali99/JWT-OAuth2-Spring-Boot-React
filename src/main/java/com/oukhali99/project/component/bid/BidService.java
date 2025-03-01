package com.oukhali99.project.component.bid;

import com.oukhali99.project.exception.EntityAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;

    public Bid save(Bid bid) throws EntityAlreadyExistsException {
        Long id = bid.getId();
        if (id != null && bidRepository.findById(id).isPresent()) throw new EntityAlreadyExistsException();
        return bidRepository.save(bid);
    }

    public List<Bid> getBidsForListing(long listingId) {
        return bidRepository.getBidsForListing(listingId);
    }
}
