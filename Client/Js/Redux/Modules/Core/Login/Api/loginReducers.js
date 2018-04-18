import { actions } from "./loginActions";

function userLoggedReducer(state, action) {
    const { data:user } = action.payload;
    return { ...state, user };
}

export const reducers = {
    [actions.userLoggedIn]: userLoggedReducer
};