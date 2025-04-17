import { User } from "modules/user";
import { Price } from "modules/common";

export interface Listing {
    id: number;
    owner: User;
    title: string;
    price: Price;
    priceHumanReadable: string
};
