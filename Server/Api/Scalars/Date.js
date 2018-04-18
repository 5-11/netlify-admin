import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const DateScalar = () => new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: value => {
        if(Object.prototype.toString.call(value) === '[object Date]') {
            return value;
        }
        return new Date(value);
    },
    serialize: value => value.getTime(),
    parseLiteral: ast => {
        if(ast.kind === Kind.INT) {
            return parseInt(ast.value, 10);
        }
        return null;
    }
});

export default DateScalar;