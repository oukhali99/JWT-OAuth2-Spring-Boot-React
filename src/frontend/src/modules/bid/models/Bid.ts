import { Price } from "modules/common";
import { User } from "modules/user";

export interface Bid {
    id: string;
    price: Price;
    bidder: User;
}
