import { useState } from "react";
import { Col, Form, Stack } from "react-bootstrap";

import { ErrorAlert, LoadingButton } from "modules/common";
import { useAppDispatch, useAppSelector } from "hooks";
import { selectors as authSelectors } from "modules/auth";
import { actions as apiActions } from "modules/api";
import { Listing } from "modules/listing";

interface Props {
    listing: Listing;
}

const AddBidControl = ({ listing }: Props) => {
    const dispatch = useAppDispatch();
    const authId = useAppSelector(authSelectors.getId);

    const [error, setError] = useState<unknown>();
    const [price, setPrice] = useState<number>();

    const isMyListing = authId?.toString() === listing.owner.id.toString();
    const placeHolderForPriceInput = isMyListing ? "Can't bid on your own listing" : "Price";

    const bidOnListing = async (listingId: number, priceDollars?: number) => {
        try {
            await dispatch(
                apiActions.authenticatedPutRequest(
                    "/bid",
                    {},
                    {
                        params: { listingId, priceDollars },
                    },
                ),
            );
            //if (response?.data?.errorCode === "SUCCESS") refresh();
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>            
            <Stack direction="horizontal" gap={3} className="mb-3">
                <Form.Control
                    type="number"
                    placeholder={placeHolderForPriceInput}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    disabled={isMyListing}
                />
                <LoadingButton onClick={() => bidOnListing(listing.id, price)} disabled={!price}>
                    Bid
                </LoadingButton>
            </Stack>
            <ErrorAlert error={error} />
        </div>
    );
};

export default AddBidControl;
