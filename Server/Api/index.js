import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { JWT_SECRET } from "../Config/Config";
import baseSchema from './BaseSchema.graphql';
import { prepareResolvers, formatError } from "./ApiUtils";
import { buildModulesApi } from "../Modules/modules";
import { authService } from "../Services/AuthService";

// TODO add logic for applying general and specific Middleware
const modulesApi = buildModulesApi();

function getApiContext({ user, token }) {
    return {
        models: modulesApi.models,
        services: {
            auth: authService
        },
        user,
        token
    };
}

const schema = makeExecutableSchema({ typeDefs: [baseSchema, ...modulesApi.schemas], resolvers: prepareResolvers(modulesApi.resolvers) });

const graphQLMiddleware = [
    bodyParser.json(),
    jwt({
        secret: JWT_SECRET,
        credentialsRequired: false,
    })
];

export const bootstrapApi = app => {

    app.use('/graphql', ...graphQLMiddleware, graphqlExpress(request => ({ schema, context: getApiContext(request), formatError })));

    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}));

    console.log('GraphQL bootstrap');

};