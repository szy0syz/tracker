import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import { InMemoryCache } from 'apollo-cache-inmemory';

export function withApollo(PageComonent) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <PageComonent {...pageProps} />
      </ApolloProvider>
    );
  };

  WithApollo.getInitialProps = async ctx => {
    const { AppTree } = ctx;
    const apolloClient = (ctx.apolloClient = initApolloClient());

    let pageProps = {};
    if (PageComonent.getInitialProps) {
      pageProps = await PageComonent.getInitialProps(ctx);
    }

    // if on server
    if (typeof window === 'undefined') {
      if (ctx.res && ctx.res.finished) {
        return pageProps;
      }

      try {
        const { getDataFromTree } = await import('@apollo/react-ssr');
        await getDataFromTree(
          <AppTree
            pageProps={{
              ...pageProps,
              apolloClient,
            }}
          />
        );
      } catch (e) {
        console.error(e);
      }

      Head.rewind();
    }

    const apolloState = apolloClient.cache.extract();
    return {
      ...pageProps,
      apolloState,
    };
  };

  return WithApollo;
}

const isDev = process.env.NODE_ENV !== 'production';
const url = isDev ? 'http://localhost:3000': 'https://tracker.yna.app';

const initApolloClient = (initialState = {}) => {
  // const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache().restore(initialState);

  const client = new ApolloClient({
    // ssrMode,
    uri: `${url}/api/graphql`,
    fetch,
    cache,
  });

  return client;
};
