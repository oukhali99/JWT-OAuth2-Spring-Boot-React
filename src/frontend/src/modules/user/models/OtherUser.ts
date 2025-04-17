import { User } from "..";

export interface OtherUser {
  user: User;
  selfUser: User;
  isAFriend: boolean;
  selfSentThisPersonAFriendRequest: boolean;
  thisPersonSentSelfAFriendRequest: boolean;
}
