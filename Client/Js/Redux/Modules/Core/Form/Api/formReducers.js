import { actions } from "./formFlow";

function formSubmitReducer(state, action) {
    const { id, data } = action.payload;
    return { ...state, forms: setFormData(state)(id, { data }) };
}

function formSubmitSuccessReducer(state, action) {
    const { id, preparedResponse, rawResponse } = action;
    const data = { preparedResponse, rawResponse };
    return { ...state, forms: setFormData(state)(id, data) };
}

function formSubmitErrorReducer(state, action) {
    const { id, error } = action;
    return { ...state, forms: setFormData(state)(id, { error }) };
}

export const reducers = {
    [actions.formSubmit]: formSubmitReducer,
    [actions.formSubmitSuccess]: formSubmitSuccessReducer,
    [actions.formSubmitError]: formSubmitErrorReducer
};


/**********************************************************************************************************************/
/************************************************ HELPERS *************************************************************/
/**********************************************************************************************************************/

function setFormData(state) {
    return function(id, data) {
        const currentData = state.forms[id] || {};
        return { ...state.forms, [id]: { ...currentData, ...data } };
    }
}