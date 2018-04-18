import { set } from 'lodash/fp';
import { actions } from "./SignUpActions";

export const reducers = {
    [actions.userSignedUp]: (state, action) => {
        const { user } = action.payload;

        return state;
    }
};