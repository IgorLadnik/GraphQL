import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { GraphQLResolveInfo } from 'graphql';
import { IResolvers } from 'graphql-tools';

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

// Type uploaded from schemas repo
class User {
  constructor(public id: number, public name: string) {}
}

const resolvers: IResolvers = {
  Query: {
    user(parent: any, args: any, context: any, info: GraphQLResolveInfo) {
      let retVal: string | undefined;

      // Verification
      if (parseAndVerifyTypeDefs(typeDefs)) {
        // Data from DB or so
        const users = new Array<User>();
        users.push(new User(1, 'Moshe Cohen'));   
        users.push(new User(2, 'Lior Ben-Ariye'));   
        
        retVal = users.find(user => user.id === args.id)?.name;
      }

      return retVal;
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

function parseAndVerifyTypeDefs(typeDefs: any): boolean {
  // Parsing
  let typeNames = new Array<string>();
  for (let i = 0; i < typeDefs.definitions.length; i++) {
    let definition = typeDefs.definitions[i];
    if (definition.kind === 'ObjectTypeDefinition') {
      if (definition.name.kind === 'Name')
        typeNames.push(definition.name.value);
    }
  }

  // Verification
  //.............

  return true;
}

/* Postman - HTTP POST

http://localhost:3000/graphql

Body -> GraphQL:

query {
  user(id: 2)
}

*/