import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema, GraphQLSchema } from 'graphql';
import { RequestInfo } from "express-graphql";
import { Person, School, Organization } from 'schema-dts';

const p: Person = {
    '@type': 'Person',
    name: 'Eve',
    affiliation: {
        '@type': 'School',
    }
};

(function main() {
    let str = p.name;

    let schema = buildSchema(`
        type Query {
            getPersons(schoolName: String!): [Person]
        }
    `);

    // let resolver = {
    //     //getDie: ({numSides}) => {
    //     getDie: (parent: any, args: any, context: any, info: GraphQLResolveInfo) =>  
    //       new RandomDie1(parent.numSides)
    // }

      let resolver = {
        getPersons: (args: any, request: any, schemaQ: any/*GraphQLSchema*/) => {
            // let yy: any;
            // if (schemaQ) {
            //     for (let i = 0; i < schemaQ.fieldNodes.length; i++) {
            //         let node = schemaQ.fieldNodes[i];
            //         let val = node.name.value;
            //     }
            // }
            // let query = request.query;
            // let url = request.url;
            // let baseUrl = request.baseUrl;
            // let originalUrl = request.originalUrl;
            // }
            return [p, p];
        },
    };  

    let app = express();
    app.use('/graphql', graphqlHTTP({
        schema,
        rootValue: resolver,
        graphiql: true,
    }));

    app.listen(4000);
    console.log('Running a GraphQL API server at localhost:4000/graphql');
})();

