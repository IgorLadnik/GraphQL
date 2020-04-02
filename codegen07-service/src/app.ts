import express from 'express';
import compression from 'compression';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import {GqlSchemaParser} from "./gqlSchemaParser";
import {GraphQLResolveInfo} from "graphql";
import _ from "lodash";

const strSchema = `
  type User {
    id: Int!
    name: String
  }

  type Query {
    getUserById(id: Int!): String
  }
`;

(async function main()
{
    const app = express();

    app.use('*', cors());
    app.use(compression());

    const gqlSchemaParser = await new GqlSchemaParser(strSchema, false).processSchema();
    let user = new gqlSchemaParser.generatedClasses[2](10, 'some-name'); //TEST

    app.use('/graphql', graphqlHTTP({
        schema: gqlSchemaParser.schema,
        rootValue: gqlSchemaParser.resolvers, // possibly before adding actual resolvers
        graphiql: true,
    }));

    let port = 3000;
    let address = `http://localhost:${port}/graphql`;

    try {
        await listen(app, port);
        console.log(`\n--- GraphQL is running on ${address}`);

        setResolversAfterStartListening(gqlSchemaParser);
    }
    catch (err) {
        console.log(`\n*** Error to listen on ${address}. ${err}`)
    }
})();

async function listen(app: any, port: number) {
  await app.listen(port);
}

function setResolversAfterStartListening(gqlSchemaParser: GqlSchemaParser) {
    const User = gqlSchemaParser.generatedClasses[2];

    // Temp. data source
    const leftPMs = [
        new User(1, 'David Ben-Gurion'),
        new User(2, 'Moshe Sharett'),
        new User(3, 'Golda Meir')
    ];

    const rightPMs = [
        new User(1, 'Menachem Begin'),
        new User(2, 'Yitzhak Shamir'),
        new User(3, 'Benjamin Netanyahu')
    ];

    var count: number = 0;

    // Periodic change of resolver for a field
    setInterval(() => {
        if (count > 10000)
            count = 0;

        let pms = count++ % 2 == 0 ? leftPMs : rightPMs;
        gqlSchemaParser.setResolver('getUserById',
            (parent: any, args: any, context: any, info: GraphQLResolveInfo) =>
                _.filter(pms, pm => pm.id === parent.id)[0]?.name
        )
    }, 1000);
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