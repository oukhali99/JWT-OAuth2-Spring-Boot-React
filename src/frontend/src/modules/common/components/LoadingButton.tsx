import React, { useState } from "react";
import { Button } from "react-bootstrap";

interface Props {
    onClick: () => Promise<void>;
    [key: string]: any;
}

const LoadingButton = ({ onClick, ...rest }: Props) => {
    const [loading, setLoading] = useState(false);

    const onClickWrapper = async (e: React.MouseEvent<HTMLButtonElement>) => {
        //e.preventDefault();
        //e.stopPropagation();
        setLoading(true);
        await onClick();
        setLoading(false);
    };

    if (loading) {
        return (
            <Button disabled {...rest}>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            </Button>
        );
    }

    return <Button onClick={onClickWrapper} {...rest} />;
};

export default LoadingButton;
