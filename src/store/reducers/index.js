import { LOAD_STATE, ACTIONS } from "../../constants";
const { SET_LOAD_STATE } = ACTIONS;

const initialState = {
  loadState: LOAD_STATE.idle
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOAD_STATE:
      return { ...state, loadState: action.payload };

    default:
      return state;
  }
}
export default rootReducer;
