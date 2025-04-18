import * as actions from "./redux/main.actions";
import * as selectors from "./redux/main.selectors";
import reducer from "./redux/main.reducer";

export { actions, selectors };
export default reducer;

export { default as Home } from "./components/Home";
export { default as About } from "./components/About";
