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

- `yarn add @apollo/react-ssr`
- `yarn add apollo-cache-inmemory`

```js

```
