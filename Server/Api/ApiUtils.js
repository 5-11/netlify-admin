import { merge } from 'lodash/fp'
import rootResolvers from './Resolvers'

export function prepareResolvers(moduleResolvers) {
    // Wrap Query and Mutation Resolvers in abstract resolver or compose them, also maybe memoize this.
    return Object.entries(moduleResolvers).reduce(
        (newResolvers, [ , resolvers]) => merge(newResolvers, resolvers),
        rootResolvers
    );
}

export function formatError(error) {
    const { originalError } = error;

    return error;
}