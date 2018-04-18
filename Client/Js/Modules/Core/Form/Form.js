import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose, join, values, map, uniqueId } from 'lodash/fp';
import { getActionCreator } from "../../../Redux/ActionCreators";
import Validators from './Validators';
import FormAlert from './FormAlert';

const FormContext = React.createContext();

export function formConsumer(Component) {
    return function FormComponent(props) {
        return (
            <FormContext.Consumer>
                {context => <Component {...props} {...context}/>}
            </FormContext.Consumer>
        );
    }
}

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.formId = uniqueId('form-');

        const {defaultModel = {}} = props;

        this.state = {
            model: defaultModel,
            errorFields: {},
            isLoading: false,
            submit: {
                success: false,
                error: null
            }
        };

        this.formFields = [];
    }

    componentWillUnmount() {

    }

    getContext = () => ({ model: { ...this.state.model }, form: this });

    isLoading = () => this.state.isLoading;

    toggleLoading = (callback = _.noop) => this.setState(({isLoading}) => ({isLoading: !isLoading}), callback);

    setFormErrors = errors => {
        const formError = compose(join(', '),map('message'),values)(errors);
        this.setState(() => ({submit: {error: formError}}));
    };

    getFormValidation = () => {
        const errorFields = this.formFields.reduce(
            (errorFields, element) => ({...errorFields, [element.props.name]: this.getElementValidation(element)}), {}
        );

        const isValid = Object.values(errorFields).reduce((formValid, element) => formValid === false ? formValid : element.isValid);

        return {isValid, errorFields};
    };

    getElementValidation = (element) => {
        const {name, validators = ''} = element.props;
        const value = this.state.model[name];

        const errors = validators.trim().split(',').reduce((errors, validator) => {
            let validatorName = validator;
            let validatorArgs = [value];

            if(validator.includes(':')) {
                const [name, ...args] = validator.split(':');
                validatorName = name;
                validatorArgs = [value, ...args];
            }

            if(validatorName) {
                if (_.isFunction(Validators[validatorName])) {
                    const {isValid, errorText} = Validators[validatorName](...validatorArgs);
                    if (!isValid) {
                        return {...errors, [validatorName]: errorText};
                    }
                    return errors;
                }
                throw new Error(`Validator ${validatorName} does not exist`);
            }
        }, {});

        return {isValid: _.isEmpty(errors), errors};
    };

    validateElement = (name) => {
        const element = _.find(this.formFields, {props: {name}});
        if(element) {
            const errorFields = this.state.errorFields[name] || {};
            this.setState(() => ({errorFields: {...errorFields, [name]: this.getElementValidation(element)}}))
        }
    };

    handleChange = ({name, value}) => {
        this.setState(({model}) => ({model: {...model, [name]: value}}), () => {
            this.validateElement(name)
        });
    };

    // This function is exposed via render props and it is used to submit form
    submit = () => {
        const {isValid, errorFields} = this.getFormValidation();

        if (isValid) {
            return this.toggleLoading(this.onSubmit);
        }

        this.setState(() => ({errorFields}), () => this.props.onError(errorFields));
    };

    onSubmit = (event) => {
        if(event) {
            return event.preventDefault();
        }

        if(this.props.onSubmitAction) {
            // This means we got redux action as onSubmit handler so we dispatch system action called formSubmit it
            // order to connect from to the store.
            
            const fromAction = this.props.onSubmitAction({model: this.state.model, form: this});
            const formSubmitAction = getActionCreator('formSubmit', true);

            return formSubmitAction({ data: this.getModel(), id: this.formId }, null, fromAction);
        }

        this.props.onSubmit({model: this.state.model, form: this});
    };

    onError = (error) => {
        this.setState(() => ({isLoading: false}));
        this.props.onError(error);
    };

    setModel = (model, callback = null) => {
        const newModel = _.merge({}, this.state.model, model);
        this.setState({model: newModel}, callback);
        
        return this;
    };

    getModel = (key = null) => {
        if (key) {
            return _.get(this.state.model, key);
        }

        return this.state.model;
    };

    prepareFormElements = (children) => {
        return React.Children.map(children, child => {
            if(!child.type) {
                return child;
            }

            const isValidElement = React.isValidElement(child) || ['input','textarea', 'select'].includes(child.type);

            if (isValidElement && _.get(child, 'props.name')) {
                return this.prepareFormElement(child);
            }

            if (React.isValidElement(child) && child.props.children) {
                const {children} = child.props;
                const newChildren = this.prepareFormElements(children);
                return React.cloneElement(child, {children: newChildren});
            }

            return child;
        })
    };

    prepareFormElement = (child) => {
        const {model, errorFields} = this.state;
        const {name} = child.props;
        const {isValid, errors = {}} = errorFields[name] || {};

        const additionalProps = {
            ...(isValid === false) ? {isValid: false, validationMessage: _.first(Object.values(errors))} : {},
            onChange: this.getFormElementOnChange(child),
            value: _.isUndefined(model[name]) ? '' : model[name]
        };

        this.formFields.push(child);

        return React.cloneElement(child, additionalProps)
    };

    renderFormChildren = () => {
        const {children} = this.props;

        if (!_.isFunction(children)) {
            throw new Error('Form must have a function as its only child!');
        }

        return this.prepareFormElements(children(this.getContext()));
    };

    getFormElementOnChange = element => {
        const {name, onChange} = element.props;

        let handleChange = event => this.handleChange({event, name, value: event.target.value, element});

        let elemOnChange = handleChange;

        if (_.isFunction(onChange)) {
            elemOnChange = event => Promise.resolve(handleChange(event)).then(() => onChange(event));
        }

        return elemOnChange;
    };

    renderAlert = () => {
        const {submit} = this.state;

        if(submit.error) {
            return <FormAlert type="danger" message={submit.error}/>;
        }

        if(submit.success) {
            return <FormAlert type="success" message={this.props.onSuccessMessage}/>;
        }

        return null;
    };

    render() {
        return (
            <React.Fragment>
                {this.renderAlert()}
                <form onSubmit={this.onSubmit}>
                    <FormContext.Provider value={this.getContext()}>
                        {this.renderFormChildren()}
                    </FormContext.Provider>
                </form>
            </React.Fragment>
        );
    }
}

FormComponent.defaultProps = {
    onSubmit: _.noop,
    onError: _.noop,
    defaultModel: {},
    onSuccessMessage: 'Your data was successfully saved.'
};

FormComponent.propTypes = {
    onSubmit: PropTypes.func,
    onError: PropTypes.func
};

export const Form = FormComponent;

export default FormComponent;