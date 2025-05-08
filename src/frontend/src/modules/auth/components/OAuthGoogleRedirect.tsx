import { useState, useEffect } from "react";

import { actions as authActions, selectors as authSelectors } from "modules/auth";
import { useAppSelector, useAppDispatch } from "hooks";

interface UserInfo {
    name: string;
    email: string;
    picture: string;
}

const OAuthGoogleRedirect = () => {
    const dispatch = useAppDispatch();
    const authId = useAppSelector(authSelectors.getId);

    const [userInfo, _setUserInfo] = useState<UserInfo | undefined>(undefined);
    const [error, _setError] = useState<string | undefined>(undefined);

    const init = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) return;
        if (authId) return;

        await dispatch(authActions.authenticateOrRegisterWithGoogle(code));
        //setUserInfo(await fetchUserInfo(accessToken));
    };

    useEffect(() => {
        init();
    }, []);

    /*
    const fetchUserInfo = async (accessToken: string) => {
        try {
            const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userInfo = await userInfoResponse.json();
            return userInfo;
        } catch (err) {
            setError("Failed to fetch user info from Google.");
            console.error(err);
        }
        return undefined;
    };
    */

    if (error) {
        return <div>{error}</div>;
    }

    if (userInfo) {
        return (
            <div>
                <h2>Welcome, {userInfo.name}!</h2>
                <p>Email: {userInfo.email}</p>
                <img src={userInfo.picture} alt="User Profile" />
            </div>
        );
    }

    //return <div>Loading...</div>;

    return <div>Login Success</div>;
};

export default OAuthGoogleRedirect;
