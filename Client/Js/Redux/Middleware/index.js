import ApiMiddleware from './ApiMiddleware';

import { middleware } from './../Modules';

// Flatten modules middleware
const appMiddleware = middleware.reduce((middleware, moduleMiddleware) => [...middleware, ...moduleMiddleware], [])

export default [
    ApiMiddleware,
    ...appMiddleware
];