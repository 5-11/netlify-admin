import { isFunction, get } from 'lodash';
import { createSelector } from 'reselect';

const getStateKey = createSelector(
    prop => prop,
);

export const mapStateToProps = (prop, key, defaultValue = {}) => (state, ownProps) => {
    const storeKey = isFunction(key) ? key(ownProps) : key;

    return { [prop]: get(state, storeKey, defaultValue) };
};