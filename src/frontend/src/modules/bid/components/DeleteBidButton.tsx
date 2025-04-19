import { LoadingButton } from "modules/common";
import { useAppDispatch, useAppSelector } from "hooks";
import { actions as apiActions } from "modules/api";
import { Bid } from "../models/Bid";
import { selectors as authSelectors } from "modules/auth";

interface Props {
    bid: Bid;
    setError: (error: unknown) => void;
    refresh: () => Promise<void>;
}

const DeleteBidButton = ({ bid, setError, refresh }: Props) => {
    const dispatch = useAppDispatch();
    const authId = useAppSelector(authSelectors.getId);

    if (authId !== bid.bidder.id) return undefined;

    const deleteListing = async () => {
        try {
            setError(undefined);
            await dispatch(apiActions.authenticatedDeleteRequest("/bid", { params: { id: bid.id } }));
            await refresh();
        }
        catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <LoadingButton variant="danger" onClick={deleteListing}>Delete</LoadingButton>
        </div>
    );
};

export default DeleteBidButton;
