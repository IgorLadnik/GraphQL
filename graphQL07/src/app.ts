import express from 'express';
import { GraphQLResolveInfo } from 'graphql';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);

// This class implements the RandomDie GraphQL type
class RandomDie1 {
  numSides: number;

  constructor(numSides: number) {
    this.numSides = numSides;
  }

  rollOnce(): number {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll(obj: any): Array<number> {
    let output = new Array<number>();
    for (let i = 0; i < obj.numRolls; i++)
      output.push(this.rollOnce());
    
    return output;
  }
}

// The root provides the top-level API endpoints
let resolver = {
  //getDie: ({numSides}) => {
  getDie: (parent: any, args: any, context: any, info: GraphQLResolveInfo) =>  
    new RandomDie1(parent.numSides)
}

let app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


/* Postman - HTTP POST

http://localhost:4000/graphql

Body -> GraphQL:

query { 
  getDie(numSides: 6) {
    rollOnce
    roll(numRolls: 3)
  }
}

*/