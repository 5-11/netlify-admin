const modules = {
};

const modulesStructure = {
    schemas: [], resolvers: {}, models: {}
};

export function buildModulesApi() {
    return Object.entries(modules).reduce((modulesApi, [moduleName, { schema, resolvers, model }]) => {
        return {
            schemas: [...modulesApi.schemas, schema],
            resolvers: { ...modulesApi.resolvers, [moduleName]: resolvers },
            models: { ...modulesApi.models, [moduleName]: model }
        }
    }, modulesStructure);
}
