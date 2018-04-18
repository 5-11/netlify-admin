export const required = value => {
    if (!(typeof value === 'undefined' || value === '' || (Array.isArray(value) && value.length === 0))) {
        return {isValid: true};
    }
    return {isValid: false, errorText: 'This field is required.'};
};

export const email = (value) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value || (value.length && emailRegex.test(value))) {
        return {isValid: true};
    }
    return {isValid: false, errorText: 'Invalid email format.'};
};

export const maxLength = (value, length) => {
    if (!value || (value.length && value.length <= length)) {
        return {isValid: true};
    }

    return {isValid: false, errorText: `This field requires ${length} characters at most`};
};

export default {
    required,
    email,
    maxLength
}