import React from "react";
import { Button } from "react-bootstrap";

const LoginWithGoogleButton = () => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const GOOGLE_RESPONSE_TYPE = "code";
  const GOOGLE_SCOPE = "profile email";

  const redirectToGoogleAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=${GOOGLE_RESPONSE_TYPE}&scope=${GOOGLE_SCOPE}`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <Button onClick={redirectToGoogleAuth}>Login with Google</Button>
    </div>
  );
};

export default LoginWithGoogleButton;
