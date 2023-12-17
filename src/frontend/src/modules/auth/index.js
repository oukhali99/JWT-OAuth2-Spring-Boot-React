import * as actions from "./redux/auth.actions";
import * as selectors from "./redux/auth.selectors";
import reducer from "./redux/auth.reducer";

export default reducer;

export { actions, selectors };
export { default as Login } from "./components/Login";
