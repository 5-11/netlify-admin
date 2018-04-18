import { createStore, applyMiddleware } from 'redux'
import middleware from './Middleware';
import {reducers} from "./Modules";

export const store = createStore(
    (state, action) => state,
    // TODO only for development
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(...middleware)
);

export const dispatch = store.dispatch;