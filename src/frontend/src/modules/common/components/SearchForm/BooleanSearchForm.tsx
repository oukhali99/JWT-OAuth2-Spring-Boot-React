import { useState } from "react";

import { BooleanSearchQuery } from "modules/common/models/SearchQuery/BooleanSearchQuery";
import { Form } from "react-bootstrap";

interface Props {
    booleanSearchQuery?: BooleanSearchQuery;
    setBooleanSearchQuery: (booleanSearchQuery?: BooleanSearchQuery) => void;
    label: string;
}

const BooleanSearchForm = ({ booleanSearchQuery, setBooleanSearchQuery, label }: Props) => {
    const [_checked, setChecked] = useState(booleanSearchQuery?.value !== undefined);

    const innerSetBooleanSearchQuery = (_e: React.ChangeEvent<HTMLInputElement>) => {
        if (_checked) {
            if (booleanSearchQuery?.value === true) {
                setChecked(true);
                setBooleanSearchQuery({ ...booleanSearchQuery, value: false });
            }
            else {
                setChecked(false);
                setBooleanSearchQuery({ ...booleanSearchQuery, value: undefined });
            }
        }
        else {
            setChecked(true);
            setBooleanSearchQuery({ ...booleanSearchQuery, value: true });
        }
    }

    return (
        <div>
            <Form.Check
                type="checkbox"
                id="boolean-search"
                checked={_checked}
                onChange={(e) => innerSetBooleanSearchQuery(e)}
                label={label}
                style={booleanSearchQuery?.value === true ? { color: "green" } : booleanSearchQuery?.value === false ? { color: "red" } : {}}
            />
        </div>
    );
};

export default BooleanSearchForm;
