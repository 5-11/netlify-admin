import { noop } from 'lodash/fp';

export const actions = {
    formSubmit: 'FORM_SUBMIT',
    formSubmitSuccess: 'FORM_SUBMIT_SUCCESS',
    formSubmitError: 'FORM_SUBMIT_ERROR',
};

function formSubmitSuccess(dispatch, formId, onSuccessCallback = noop) {
    return function (preparedResponse, rawResponse) {
        dispatch({ type: actions.formSubmitSuccess, id: formId, preparedResponse, rawResponse });
        onSuccessCallback(preparedResponse, rawResponse);
    }
}

function formSubmitError(dispatch, formId, onErrorCallback = noop) {
    return function (error) {
        dispatch({ type: actions.formSubmitError, error, id: formId });
        onErrorCallback(error);
    }
}

const FormMiddleware = ({dispatch}) => next => action => {
    next(action);

    // When form is submitted formSubmit action is dispatched with fromAction param which is the action that should 
    // happen on form submit. It this middleware we intercept it here and enhance it by wrapping onSuccess and onError 
    // callbacks. This enables us to send success response or error to corresponding form key in state
    if(action.type === actions.formSubmit) {
        const { id:formId, fromAction:onSubmitAction } = action;
        const { onSuccess, onError } = onSubmitAction.payload;
        
        const enhancedPayload = { 
            ...onSubmitAction.payload,
            onSuccess: formSubmitSuccess(dispatch, formId, onSuccess),
            onError: formSubmitError(dispatch, formId,  onError) 
        };
        
        const enhancedAction = { ...onSubmitAction, payload: enhancedPayload }; 

        dispatch(enhancedAction);
    }
};

export default [FormMiddleware];