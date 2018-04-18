import React, {Component} from 'react';
import Form from '../../Form/Form';
import { connect } from 'react-redux';
import { getActionCreator } from "../../../../Redux/ActionCreators/index";

class LoginForm extends Component {

    formProps = {
        onSubmitAction: ({ model:data }) => getActionCreator('userSignUp')({ data }),
        defaultModel: {email: 'leon.jerinic@gmail.com', password: 'dev'}
    };

    render() {
        return (
            <Form {...this.formProps}>
                {({ form }) => (
                    <React.Fragment>

                        <label>Email</label>
                        <input type="text" name="email"/>

                        <label>Password</label>
                        <input type="password" name="password"/>

                        <button onClick={form.submit}>Login</button>

                    </React.Fragment>
                )}
            </Form>
        );
    }
}

export default connect(null)(LoginForm);