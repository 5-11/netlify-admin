import React, {Component} from 'react';
import Form from '../../Form/Form';
import { userSignUp } from "../../../../Redux/Modules/Core/SignUp/Api/SignUpActions";
import { connect } from 'react-redux';

class SignUpForm extends Component {

    signUp = ({ model }) => this.props.userSignUp(model);

    render() {
        return (
            <Form onSubmit={this.signUp}>
                {({form}) => (
                    <React.Fragment>
                        <input type="text" name="email"/>
                        <input type="password" name="password"/>
                        <button onClick={form.submit}>Sign up</button>
                    </React.Fragment>
                )}
            </Form>
        );
    }
}

export default connect(null, { userSignUp })(SignUpForm);