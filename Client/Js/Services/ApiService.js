import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql'});

const authLink = setContext((_, { headers }) => {
     const token = localStorage.getItem('token');

     return {
         headers: {
             ...headers,
             ...(token) ? { authorization: `Barer ${token}}` } : { }
         }
     }
});

export const graphQLApi = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});