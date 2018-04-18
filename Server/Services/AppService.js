import config from '../Config/Config';
import http from 'http';
import { handleError } from "./ErrorHandler";

export const runApp = app => {
    config.server.port = 8080;
    app.set('port', config.server.port);

    const server = http.createServer(app);

    server.listen(config.server.port);

    server.on('error', (error) => {
        if(error.code === 'EADDRINUSE') {
            server.listen(++config.server.port);
        } else {
            handleError(error);
        }
    });

    server.on('listening', () => {
        // log server start
        console.log(`Server is running at ${config.server.port}`);
    });

    // Move this somewhere where logical
    process.on('unhandledRejection', reason => {
        // I just caught an unhandled promise rejection, since we already have fallback handler for unhandled errors (see below), let throw and let him handle that
        throw reason;
    });

    process.on('uncaughtException', (error) => {
        // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
        handleError(error).then(error => {
            if (!error.isOperational) {
                process.exit(1);
            }
        });
    });

    process.on('SIGINT', function() {
        console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
        // some other closing procedures go here
        process.exit(1);
    });

    return app;
};