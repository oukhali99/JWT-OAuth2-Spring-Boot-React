package com.oukhali99.project.component.bid;

import com.oukhali99.project.component.bid.model.search.BidSearchQuery;
import com.oukhali99.project.exception.EntityAlreadyExistsException;
import com.oukhali99.project.exception.EntityDoesNotExistException;
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

    public List<Bid> findAll() {
        return bidRepository.findAll();
    }

    public List<Bid> search(BidSearchQuery bidSearchQuery) {
        return findAll().stream().filter(bidSearchQuery::match).toList();
    }

    public void deleteById(long id) throws EntityDoesNotExistException {
        if (!bidRepository.existsById(id)) throw new EntityDoesNotExistException();
        bidRepository.deleteById(id);
    }

    public Bid getById(long id) throws EntityDoesNotExistException {
        return bidRepository.findById(id).orElseThrow(EntityDoesNotExistException::new);
    }
}
