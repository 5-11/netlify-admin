import bunyan from 'bunyan';
import config from '../Config/Config';

export const log = bunyan.createLogger({name: config.app.name});