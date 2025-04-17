import { ApiPayloadData } from "modules/api/models/ApiPayloadData";
import { User } from "modules/user/models/User";

interface UserAndToken {
    token: string;
    user: User;
};

export class ApiAuthResponse extends ApiPayloadData<UserAndToken> {};
