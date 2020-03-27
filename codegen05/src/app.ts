import express from 'express';
import _ from 'lodash';
import compression from 'compression';
import cors from 'cors';
import { GraphQLResolveInfo, buildSchema, GraphQLSchema, printSchema, parse } from 'graphql';
import graphqlHTTP from 'express-graphql';
import { User, schema } from './generate';

const users: Array<User> = [
  { id: 1, name: 'David Ben-Gurion' },
  { id: 2, name: 'Moshe Sharett' },
  { id: 3, name: 'Levi Eshkol' },
  { id: 4, name: 'Golda Meir' },
];

const resolvers = {
    user(parent: any, args: any, context: any, info: GraphQLResolveInfo) {
       return _.filter(users, user => user.id === parent.id)[0].name;
    }
};

const app = express();

app.use('*', cors());
app.use(compression());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen({ port: 3000 }, (): void =>
  console.log(`\n\t --- GraphQL is running on http://localhost:3000/graphql`)
);

/* Postman - HTTP POST

http://localhost:3000/graphql

Body -> GraphQL:

query {
  user(id: 2)
}

*/