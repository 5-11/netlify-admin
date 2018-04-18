import { actions } from "./SignUpActions";
import { graphQLMutation } from "../../../../Middleware/ApiMiddleware";
import gql from 'graphql-tag';

const signUp = ({ dispatch }) => next => action => {
    next(action);

    if(actions.userSignUp === action.type) {

        const mutation = gql`
            mutation UserSignUp($email: String!, $password: String!) {
                userSignUp(email: $email, password: $password) {
                    email,
                    token
                }
            }
        `;

        const payload = { mutation };

        dispatch(graphQLMutation({ payload, action }));
    }
};

export const SignUpFlow = [ signUp ];