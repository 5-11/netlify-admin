import { actions } from './userActions';
import gql from "graphql-tag";
import {graphQLMutation} from "../../../../Middleware/ApiMiddleware";

const userLogin = ({ dispatch }) => next => action => {
    next(action);

    if(action.type === actions.userLogin) {
        const mutation = gql`
            mutation UserLogin($email: String!, $password: String!) {
                userLogin(email: $email, password: $password) {
                    email
                    token
                }
            }
        `;

        const payload = { mutation };
        
        dispatch(graphQLMutation({ payload, action }));
    }
};

export const UserLoginFlow = [ userLogin ];