import express from 'express';
import _ from 'lodash';
import compression from 'compression';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { resolvers, schema, AddResolversAfterStartListening } from './generate';

const app = express();

app.use('*', cors());
app.use(compression());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

let port = 3000;
let address = `http://localhost:${port}/graphql`;
listen(app, port)
  .then(
    () => {
      console.log(`\n--- GraphQL is running on ${address}`);
      AddResolversAfterStartListening();
    },
    reject => console.log(`\n*** Error to listen on ${address}. ${reject}`)
  );

async function listen(app: any, port: number) {
  await app.listen(port);
}



/* GraphiQL 

query {
  getUserById(id: 5)
}

*/

/* Postman - HTTP POST

http://localhost:3000/graphql

Body -> GraphQL:

query {
  getUserById(id: 5)
}

*/