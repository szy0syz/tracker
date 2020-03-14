import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import fetch from 'isomorphic-unfetch';

export function withApollo(PageComonent) {
  const WithApollo = props => {
    const client = new ApolloClient({
      uri: 'http://localhost:3000/api/graphql',
      fetch,
    });

    return (
      <ApolloProvider client={client}>
        <PageComonent {...props} />
      </ApolloProvider>
    );
  };

  return WithApollo;
}
