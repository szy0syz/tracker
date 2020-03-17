# tracker

> a next.js demo

## Deploy

- Zeit
- MongoDB Atlas (Google Cloud - Taiwan)

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

## MongoDB

- `yarn add mongoose`

```js
import mongoose from 'mongoose';

const connnectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return handler(req, res);
};

const db = mongoose.connection;
db.once('open', () => {
  console.info('[ info ]', 'Connected to mongo');
});

export default connnectDB;
```

## Graphql API

- `yarn add babel-plugin-import-graphql --dev`

```json
{
  "presets": ["next/babel"],
  "plugins": ["import-graphql"]
}
```

- `yarn add graphql-toolkit`

```js
import { ApolloServer, gql } from 'apollo-server-micro';
import { mergeResolvers, mergeTypeDefs } from 'graphql-toolkit';
import { habitsresolvers } from '../../api/habits/resolves';
import { habitsMutations } from '../../api/habits/mutations';
import Habits from '../../api/habits/Habits.graphql';

import connectDB from '../../lib/mongoose';

const fakeTypeDefs = gql`
  type Query {
    sayHello: String
  }
`;

const fakeResolvers = {
  Query: {
    sayHello: () => {
      return 'Hello @.@ Jerry';
    },
  },
};

const resolvers = mergeResolvers([fakeResolvers, habitsresolvers, habitsMutations]);
const typeDefs = mergeTypeDefs([fakeTypeDefs, Habits]);

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = apolloServer.createHandler({ path: '/api/graphql' });

export default connectDB(server);
```

## Graphql Query

```js
const GET_HABITS = gql`
  query getHabits {
    habits {
      _id
      name
    }
  }
`;

const HabitList = () => {
  const { data, loading } = useQuery(GET_HABITS);
  if (loading) return <section />;

  const { habits } = data;

  return (
    <section>
      <h2>My Habit</h2>
      {habits.map((habit, index) => (
        <Habit key={habit._id} habit={habit} index={index} />
      ))}
    </section>
  );
};
```

## Graphql action

```js
const ADD_HABIT = gql`
  mutation addHabit($habit: HabitInput) {
    addHabit(habit: $habit) {
      _id
      name
    }
  }
`;

const HabitForm = () => {
  const [addHabit] = useMutation(ADD_HABIT, {
    //* 注意：这里只能拿到前端的 Query，别去后端找！
    refetchQueries: ['getHabits'],
  });

  return (
    <Form
      onSubmit={data => {
        addHabit({
          variables: {
            habit: {
              name: data.habit,
            },
          },
        });
      }}
    >
      <Field>Habit</Field>
    </Form>
  );
};
```

## event

- `yarn add graphql`

> Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

```js
export const habitsResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); //value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};
```
