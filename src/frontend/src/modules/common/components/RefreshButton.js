import { Button } from "react-bootstrap";
import React from "react";

const RefreshButton = ({ refresh }) => {
    return <Button onClick={refresh}>Refresh</Button>;
};

export default RefreshButton;
