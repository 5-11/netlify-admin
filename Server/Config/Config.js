import dotenv from 'dotenv';

dotenv.config();

export const app = {
    name: 'Test app'
};

export const db = {
    uri: process.env.MONGO_URI
};

export const server = {
    port: parseInt(process.env.SERVER_PORT) || 4000
};

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default { app, server, db, JWT_SECRET };