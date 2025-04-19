import { useState, useEffect } from "react";

import { OtherUserSearchQuery } from "modules/user/models/SearchQuery/OtherUserSearchQuery";
import UserSearchForm from "./UserSearchForm";
import BooleanSearchForm from "modules/common/components/SearchForm/BooleanSearchForm";

interface Props {
    setOtherUserSearchQuery: (otherUserSearchQuery?: OtherUserSearchQuery) => void;
    otherUserSearchQuery?: OtherUserSearchQuery;
};

const OtherUserSearchForm = ({ otherUserSearchQuery, setOtherUserSearchQuery }: Props) => {
    const [userSearchQuery, setUserSearchQuery] = useState(otherUserSearchQuery?.userSearchQuery);
    const [isAFriendSearchQuery, setIsAFriendSearchQuery] = useState(otherUserSearchQuery?.isAFriendSearchQuery);
    const [selfSentThisPersonAFriendRequestSearchQuery, setSelfSentThisPersonAFriendRequestSearchQuery] = useState(otherUserSearchQuery?.selfSentThisPersonAFriendRequestSearchQuery);
    const [thisPersonSentSelfAFriendRequestSearchQuery, setThisPersonSentSelfAFriendRequestSearchQuery] = useState(otherUserSearchQuery?.thisPersonSentSelfAFriendRequestSearchQuery);

    useEffect(() => {
        setOtherUserSearchQuery({
            userSearchQuery: userSearchQuery,
            isAFriendSearchQuery: isAFriendSearchQuery,
            selfSentThisPersonAFriendRequestSearchQuery: selfSentThisPersonAFriendRequestSearchQuery,
            thisPersonSentSelfAFriendRequestSearchQuery: thisPersonSentSelfAFriendRequestSearchQuery,
        });
    }, [userSearchQuery, isAFriendSearchQuery, selfSentThisPersonAFriendRequestSearchQuery, thisPersonSentSelfAFriendRequestSearchQuery]);

    return (
        <div>
            <UserSearchForm userSearchQuery={userSearchQuery} setUserSearchQuery={setUserSearchQuery} />
            <BooleanSearchForm booleanSearchQuery={isAFriendSearchQuery} setBooleanSearchQuery={setIsAFriendSearchQuery} label={"Is A Friend"} />
            <BooleanSearchForm booleanSearchQuery={selfSentThisPersonAFriendRequestSearchQuery} setBooleanSearchQuery={setSelfSentThisPersonAFriendRequestSearchQuery} label={"Friend Request Sent"} />
            <BooleanSearchForm booleanSearchQuery={thisPersonSentSelfAFriendRequestSearchQuery} setBooleanSearchQuery={setThisPersonSentSelfAFriendRequestSearchQuery} label={"Friend Request Received"} />
        </div>
    );
};

export default OtherUserSearchForm;
