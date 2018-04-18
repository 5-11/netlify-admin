import { handleError } from "./ErrorHandler";

const noop = () => undefined;

export async function asyncHandler(asyncFunction, onSuccess = noop, onError = noop) {
    let response = null;
    try {
        const data = await (async () => await asyncFunction())();
        response = onSuccess({ data });
    } catch (error) {
        await handleError(error);
        response = await (async () => await onError(error))();
    }
    return response;
}

export function exportModuleFactory(schema, resolvers, model) {
    return { schema, resolvers, model };
}