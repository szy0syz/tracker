# tracker

> a next.js demo

## Notes

### 关于 'next/head'

- 注意啊，这里 `<Head>` 处理的是 `html` 文档的 `head` 标签内容

```js
import Head from 'next/head';

const Layouts = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  );
};
```

### perfetch

```js
<Link perfetch={false} href="/about">
  <a>About</a>
</Link>
```

### 取路由的 query

```js
// pages/event/[id].js
import { useRouter } from 'next/router';

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h1>{id}</h1>
    </Layout>
  );
};
```

### 关于 api 请求集成

```js
// pages/api/graphql.js
export default (req, res) => {
  // 简写
  res.status(200).json({
    test: 'hello @@',
  });

  // res.setHeader('Content-Type', 'application/json');
  // res.statusCode = 200;
  // res.end(
  //   JSON.stringify({
  //     test: 'hello @@@',
  //   })
  // );
};
```

### 关于 Apollo-Server 集成

- `yarn add apollo-server-micro`

```js
// pages/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`;

const resolvers = {
  Query: {
    sayHello: () => {
      return 'Hello @.@';
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

// 送给 nextjs 用的！
export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
```

### 关于 Apollo-client 集成

- `yarn add @apollo/react-hooks apollo-boost`
- `yarn add isomorphic-unfetch`
- `yarn add gtaphql-tag`

### 初始化 client

```js
// lib/apollo.js
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
```

### 页面中使用 graphql

```js
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const Hello_Query = gql`
  query HelloQuery {
    sayHello
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(Hello_Query);
  if (loading) return <div />;

  return <div>{data.sayHello}</div>;
};
```

## Apollo client SSR

> 在 `nest.js` 中开启 `apollo-client` 的 `ssr` 真难配！

- `yarn add @apollo/react-ssr`
- `yarn add apollo-cache-inmemory`

```js
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

const initApolloClient = (initialState = {}) => {
  // const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache().restore(initialState);

  const client = new ApolloClient({
    // ssrMode,
    uri: 'http://localhost:3000/api/graphql',
    fetch,
    cache,
  });

  return client;
};
```

## CSS in jsx

- `yarn add @leveluptuts/fresh`

```js
const HabitButton = ({ date }) => {
const [complete, setComplete] = useState(false);
return (
  <span>
    {date.getMonth() + 1}/{date.getDate()}
    <button onClick={() => setComplete(!complete)}>{complete ? 'X' : 'O'}</button>
    <style jsx>
      {`
        span {
          display: flex;
          flex-direction: column;
        }
        span + span {
          margin-left: 10px;
        }
        button {
          margin-top: 1rem;
          border: none;
        }
      `}
    </style>
  </span>
);
```

## DotEnt

- `yarn add dotnev`

```js
// next.config.js
const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

module.export = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return config;
  },
};

// ------------
// read
console.log('[env]', process.env.MONGO_URL);
```
