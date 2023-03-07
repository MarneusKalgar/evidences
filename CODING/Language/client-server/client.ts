import { ApolloClient, InMemoryCache, defaultDataIdFromObject, ApolloLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import Cookies from 'js-cookie';

export const TOKEN = 'token';

const httpLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
    headers: {
        "apollo-require-preflight": true,
    },
});

const authLink = setContext((_, { headers }) => {
    const token = Cookies.get(TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? token : '',
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ extensions, message, locations, path }) => {
            if (extensions?.code === 'UNAUTHENTICATED') {
                window.location.href = '/login';
                return;
            }

            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

export const client = new ApolloClient({
    link: ApolloLink.from([errorLink as any, authLink, httpLink]),
    cache: new InMemoryCache({
        dataIdFromObject: (object: any) => {
            switch (object.__typename) {
                case 'KeyDisplayName':
                    return object.key + object.displayName;
                default:
                    return defaultDataIdFromObject(object); // fall back to default handling
            }
        },
    }),
});
