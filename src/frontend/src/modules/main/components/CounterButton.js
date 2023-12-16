import React from "react";
import { connect } from "react-redux";

import { actions as mainActions } from "modules/main";

const CounterButton = ({ setAppState }) => {
    return <>Test123</>;
};

const stateToProps = (state) => ({});

const dispatchToProps = {
    setAppState: mainActions.setAppState,
};

export default connect(stateToProps, dispatchToProps)(CounterButton);
