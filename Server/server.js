import 'babel-polyfill';
import express from 'express';
import { registerMiddlewares } from "./Middlewares";
import { bootstrapApi } from "./Api";
import { runApp } from "./Services/AppService";
import { handleError } from "./Services/ErrorHandler";

(async (app) => {
    try {
        await Promise.all([
            registerMiddlewares(app),
            bootstrapApi(app),
            runApp(app)
        ]);
    } catch (error) {
        await handleError(error);
    }
})(express());

