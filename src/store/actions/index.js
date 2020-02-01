import { ACTIONS } from "../../constants";

export function dispatchLoadState(dispatch, loadStateStr) {
  dispatch({ type: ACTIONS.SET_LOAD_STATE, payload: loadStateStr });
}
