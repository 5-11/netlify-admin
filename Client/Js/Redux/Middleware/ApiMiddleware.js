import { graphQLApi } from "../../Services/ApiService";
import { noop, compose, first, entries } from 'lodash/fp';

export const graphQLActions = {
    query: 'GRAPHQL_QUERY',
    mutation: 'GRAPHQL_MUTATION'
};

/**********************************************************************************************************************/
/*********************************************** ACTION CREATORS ******************************************************/
/**********************************************************************************************************************/

export function graphQLQuery({ payload, meta, action }) {
    const { data:variables } = action.payload;
    const composedPayload = { ...payload, variables, ...action.payload };
    
    return { type: graphQLActions.query, payload: composedPayload, meta, fromAction: action };
}

export function graphQLMutation({ payload, meta, action }) {
    const { data:variables } = action.payload;
    const composedPayload = { ...payload, variables, ...action.payload };

    return { type: graphQLActions.mutation, payload: composedPayload, meta, fromAction: action };
}

/**********************************************************************************************************************/
/*********************************************** API HANDLERS ** ******************************************************/
/**********************************************************************************************************************/

// Default prepare response we extract only level
const defaultResolver = ({ data }) => compose(([, data]) => data, first, entries)(data);

const onErrorHandler = (dispatch, fromAction, onErrorCallback) => (error) => {
    dispatch({type: `${fromAction.type}_ERROR`, payload: { error }, meta: { fromAction }});
    onErrorCallback(error);
};

const onSuccessHandler = (dispatch, fromAction, onSuccessCallback) => (rawResponse) => {
    // Check if prepareResponse was passed...in case of complex queries or multiple mutations when we receive multiple responses.
    const { resolver = defaultResolver } = fromAction;
    
    const preparedResponse = resolver(rawResponse);
    
    dispatch({type: `${fromAction.type}_SUCCESS`, payload: preparedResponse  , meta: { fromAction }});
    
    onSuccessCallback(preparedResponse, rawResponse);
};

/**********************************************************************************************************************/
/*********************************************** API MIDDLEWARE *******************************************************/
/**********************************************************************************************************************/

export const GraphQLMiddleware = ({dispatch}) => next => action => {
    next(action);

    if(isGraphQLAction(action)) {
        const { variables = {}, onSuccess = noop, onError = noop } = action.payload;

        if(action.type === graphQLActions.mutation) {
            const { mutation } = action.payload;

            graphQLApi.mutate({ mutation, variables })
                .then(onSuccessHandler(dispatch, action, onSuccess))
                .catch(onErrorHandler(dispatch, action, onError));
        }

        if(action.type === graphQLActions.query) {
            const { query } = action.payload;

            graphQLApi.query({ query, variables })
                .then(onSuccessHandler(dispatch, action, onSuccess))
                .catch(onErrorHandler(dispatch, action, onError));
        }
    }
};

function isGraphQLAction(action) {
    return Object.values(graphQLActions).includes(action.type);
}

export default GraphQLMiddleware;