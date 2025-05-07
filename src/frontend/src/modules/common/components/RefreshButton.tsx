import { useState } from "react";

import { LoadingButton } from "modules/common";

interface Props {
    refresh: () => Promise<void>;
}

const RefreshButton = ({ refresh }: Props) => {
    const [message, setMessage] = useState<string>();

    const onClick = async () => {
        setMessage("Refreshing...");
        await refresh();
        setMessage(undefined);
    };

    return (
        <div>
            <LoadingButton onClick={onClick}>Refresh</LoadingButton>
            {message}
        </div>
    );
};

export default RefreshButton;
