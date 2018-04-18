import Login from './Core/Login';
import SignUp from './Core/SignUp';
import Form from './Core/Form';

const modules = {
    Login,
    SignUp,
    Form
};

function buildActionCreator(actionType) {
    return function (payload, meta, fromAction) {
        return { type: actionType, payload, meta, fromAction };
    }
}

function buildActionCreators(actionCreators = {}, moduleActions, name) {
    return Object.entries(moduleActions).reduce((actionCreators, [creatorName, actionName]) => {
        if(actionCreators[creatorName]) {
            throw Error(`Duplicate action creator name for ${actionName} action in ${name} module.`);
        }

        return { ...actionCreators, [creatorName]: buildActionCreator(actionName) };
    }, actionCreators);
}

const modulesStructure = {
    actions: {},
    actionCreators: {},
    reducers: {},
    middleware: [],
};

function prepareModules(modules) {
    return Object.entries(modules).reduce(({ actions, actionCreators, middleware, reducers }, [name, module]) => {
        const moduleName = name.toLowerCase();
        const { reducers:moduleReducers } = module;
        
        return {
            actions: { ...actions, [moduleName]: module.actions },
            actionCreators: buildActionCreators(actionCreators, module.actions, name),
            reducers: { ...reducers, ...(moduleReducers) ? { [moduleName]: moduleReducers } : { } },
            middleware: [ ...middleware, module.middleware ]
        };
    }, modulesStructure);
};

// TODO do this in more appropriate manner 

const preparedModules = prepareModules(modules);

export const middleware = preparedModules.middleware;

export const actionCreators = preparedModules.actionCreators;

export const actions = preparedModules.actions;

export const reducers = preparedModules.reducers;