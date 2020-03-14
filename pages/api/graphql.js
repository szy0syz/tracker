import { ApolloServer, gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`;

const resolvers = {
  Query: {
    sayHello: () => {
      return 'Hello @.@ Jerry';
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
