import { bindActionCreators } from 'redux'
import { get, has } from 'lodash/fp';
import { actionCreators } from "../Modules";
import { dispatch } from "../index";

export const getActionCreator = (name, bind = false) => {
    if(has(name, actionCreators)) {
        const actionCreator = get(name, actionCreators);
        return bind ? bindActionCreators(actionCreator, dispatch) : actionCreator;
    }
    throw new Error(`Action creator ${name} not found in actionCreators.`);
};

export default actionCreators;