import { useEffect, useState } from "react";
import { UserSearchQuery } from "modules/user/models/SearchQuery/UserSearchQuery";
import { StringSearchForm } from "modules/common";

interface Props {
    setUserSearchQuery: (userSearchQuery?: UserSearchQuery) => void;
    userSearchQuery?: UserSearchQuery;
}

const UserSearchForm = ({ userSearchQuery, setUserSearchQuery }: Props) => {
    const [firstNameSearchQuery, setFirstNameSearchQuery] = useState(userSearchQuery?.firstNameSearchQuery);
    const [lastNameSearchQuery, setLastNameSearchQuery] = useState(userSearchQuery?.lastNameSearchQuery);
    const [emailSearchQuery, setEmailSearchQuery] = useState(userSearchQuery?.emailSearchQuery);

    useEffect(() => {
        setUserSearchQuery({
            firstNameSearchQuery: firstNameSearchQuery,
            lastNameSearchQuery: lastNameSearchQuery,
            emailSearchQuery: emailSearchQuery,
        });
    }, [firstNameSearchQuery, lastNameSearchQuery, emailSearchQuery]);

    return (
        <div>
            <StringSearchForm stringSearchQuery={firstNameSearchQuery} setStringSearchQuery={setFirstNameSearchQuery} />
            <StringSearchForm stringSearchQuery={lastNameSearchQuery} setStringSearchQuery={setLastNameSearchQuery} />
            <StringSearchForm stringSearchQuery={emailSearchQuery} setStringSearchQuery={setEmailSearchQuery} />
        </div>
    );
};

export default UserSearchForm;
