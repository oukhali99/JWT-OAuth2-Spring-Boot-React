import { Button } from "react-bootstrap";
import React, { useState } from "react";

const RefreshButton = ({ refresh }) => {
    const [message, setMessage] = useState();

    const onClick = async () => {
        setMessage("Refreshing...");
        await refresh();
        setMessage(undefined);
    };

    return (
        <div>
            <Button onClick={onClick}>Refresh</Button>
            {message}
        </div>
    );
};

export default RefreshButton;
