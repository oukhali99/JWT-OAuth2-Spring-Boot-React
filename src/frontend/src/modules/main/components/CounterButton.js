import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import { actions as mainActions, selectors as mainSelectors } from "modules/main";

const CounterButton = ({ incrementCounter, counter }) => {
    return <Button onClick={incrementCounter}>{counter}</Button>
};

const stateToProps = (state) => ({
    counter: mainSelectors.getCounter(state)
});

const dispatchToProps = {
    incrementCounter: mainActions.incrementCounter,
};

export default connect(stateToProps, dispatchToProps)(CounterButton);
