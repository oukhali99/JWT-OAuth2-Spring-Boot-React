import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { actions as authActions, selectors as authSelectors } from "modules/auth";
import { useAppStore, useAppDispatch } from "hooks";

interface UserInfo {
    name: string;
    email: string;
    picture: string;
}

const OAuthGoogleRedirect = () => {
    const dispatch = useAppDispatch();

    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    const init = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        
        if (!code) return;
        if (authSelectors.getId(useAppStore().getState())) return;

        const accessToken = await fetchAccessToken(code);
        if (!accessToken) return;

        setUserInfo(await fetchUserInfo(accessToken));
        await dispatch(authActions.authenticateOrRegisterWithGoogle(accessToken));
    }

    useEffect(() => {
        init();
    }, []);

    const fetchAccessToken = async (code: string) => {
        try {
            const params = new URLSearchParams();
            params.append("code", code);
            params.append("client_id", CLIENT_ID);
            params.append("client_secret", CLIENT_SECRET);
            params.append("redirect_uri", REDIRECT_URI);
            params.append("grant_type", "authorization_code");
            const response = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                body: params,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error_description || "Failed to fetch access token");
            }

            // Step 4: Use the access token to fetch user info from Google
            const { access_token } = data;
            return access_token;
        } catch (err) {
            setError("Failed to exchange authorization code for access token.");
            console.error(err);
        }
        return undefined;
    };

    const fetchUserInfo = async (accessToken: string) => {
        try {
            const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userInfo = await userInfoResponse.json();
            return userInfo
        } catch (err) {
            setError("Failed to fetch user info from Google.");
            console.error(err);
        }
        return undefined;
    };

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

    return <div>Loading...</div>;
};

export default OAuthGoogleRedirect;
