class AppErrorClass extends Error {
    constructor({name, httpCode, description, isOperational = false}) {
        super();

        this.name = name;
        this.isOpearational = isOperational;
        this.httpCode = httpCode;
        this.description = description;
    }
}

export async function handleError(error) {
    console.log(error, 'error');
    await logError(error);
    await sendMailIfCritical(error);
    await determineIfOperational(error);

    return error;
}

function logError(error) {
    console.log('Error logged');
    return error;
}

function sendMailIfCritical(error) {
    console.log('Error email sent');
    return error;
}

function determineIfOperational(error) {
    console.log('Is error operational?');
    return error;
}

export const AppError = AppErrorClass;