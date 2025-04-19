import { Button, Modal, Row } from "react-bootstrap";

import { BidHome } from "modules/bid";
import { Listing } from "..";

interface Props {
    show: boolean;
    onHide: () => void;
    listing: Listing;
}

const ListingModal = ({ show, onHide, listing }: Props) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{listing?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>ID</h4>
                <p>{listing.id}</p>
                <h4>Owner</h4>
                <p>{listing.owner.email}</p>
                <h4>Bid</h4>
                <Row className="mt-3">
                    <BidHome listing={listing} />
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ListingModal;
