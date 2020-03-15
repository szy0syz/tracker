import { ApolloServer, gql } from 'apollo-server-micro';
import { mergeResolvers, mergeTypeDefs } from 'graphql-toolkit';
import { habitsResolvers } from '../../api/habits/resolves';
import { habitsMutations } from '../../api/habits/mutations';
import Habits from '../../api/habits/Habits.graphql'

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

const resolvers = mergeResolvers([fakeResolvers, habitsResolvers, habitsMutations]);
const typeDefs = mergeTypeDefs([fakeTypeDefs, Habits]);

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = apolloServer.createHandler({ path: '/api/graphql' });

export default connectDB(server);
