import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { GraphQLResolveInfo } from 'graphql';
import { User } from './generated';

// Query from client
const typeDefs = gql`
  type User {
    id: Int!
    name: String
  }

  type Query {
    user(id: Int!): String
  }
`;

const users: Array<User> = [
  { id: 1, name: 'David Ben-Gurion' },
  { id: 2, name: 'Moshe Sharett' },
  { id: 3, name: 'Levi Eshkol' },
  { id: 4, name: 'Golda Meir' },
];

const resolvers = {
  Query: {
    user(parent: any, args: any, context: any, info: GraphQLResolveInfo) {
      return users.find(u => u.id === args.id)?.name;
    }
  }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

app.use('*', cors());
app.use(compression());
server.applyMiddleware({ app, path: '/graphql' });
const httpServer = createServer(app);

httpServer.listen({ port: 3000 }, (): void =>
  console.log(`\nGraphQL is running on http://localhost:3000/graphql`)
);

/* Postman - HTTP POST

http://localhost:3000/graphql

Body -> GraphQL:

query {
  user(id: 2)
}

*/