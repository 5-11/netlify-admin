import { handleError } from "../Services/ErrorHandler";

export const errorMiddleware = (err, req, res, next) => {
    handleError(err).then(error => {
        if (!error.isOperational)
            next(err);
    });
};