import { Button } from "react-bootstrap";
import React, { useState } from "react";

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
      <Button onClick={onClick}>Refresh</Button>
      {message}
    </div>
  );
};

export default RefreshButton;
