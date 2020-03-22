const express = require('express');
const graphqlHTTP = require('express-graphql');
import {buildSchema, GraphQLSchema} from 'graphql';
import { RequestInfo } from "express-graphql";

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
let resolver = {
    hello: (args: any, request: any, schemaQ: any/*GraphQLSchema*/) => {
        let yy: any;
        if (schemaQ) {
            for (let i = 0; i < schemaQ.fieldNodes.length; i++) {
                let node = schemaQ.fieldNodes[i];
                let val = node.name.value;
            }
        }
        let query = request.query;
        let url = request.url;
        let baseUrl = request.baseUrl;
        let originalUrl = request.originalUrl;
        return 'Hello world!';
    },
};

let resolverQ = {
    hello: (args: any, request: any) => {
        return 'Qqq';
    },
};

function ext(info: RequestInfo) {
    let opName = info.operationName;
};

let app = express();
app.use('/v1/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    extensions: ext
}));

app.use('/v1/q', graphqlHTTP({
    schema: schema,
    rootValue: resolverQ,
    graphiql: true,
    extensions: ext
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/v1/...');

/* Test

Postman - HTTP POST: Body -> GraphQL: 
{ hello }

GraphiQL: 
{ hello }

http://localhost:4000/v1/graphql
http://localhost:4000/v1/q

*/