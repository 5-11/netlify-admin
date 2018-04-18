import helmet from "helmet";
import cors from 'cors';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorMiddleware } from "./ErrorMiddleware";
import fsExpressApi from './fs/fs-express-api';
export const registerMiddlewares = async app => {

    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(cookieParser());
    app.use(errorMiddleware);
    fsExpressApi(app);
    /*app.use(session({
        secret: process.env.sessionSecret,
        cookie: {  httpOnly: true,  secure: true  }
    }));*/
};