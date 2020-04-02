import { GqlSchemaParser } from './gqlSchemaParser';

// Input: GQL schema
const inputStrSchema = `
  type User {
    id: Int!
    name: String
  }

  type Query {
    getUserById(id: Int!): String
  }
`;

//const schemaFilePath = 'C:/prj/GraphQL/codegen07-generator/__schema.graphql';

(async function main() {
    const gqlSchemaParser = await new GqlSchemaParser(inputStrSchema/*schemaFilePath*/, true).processSchema();

    const user = new gqlSchemaParser.generatedClasses.User(139, 'myName');
    console.log(`user -> ${user.id} ${user.name}`)
})();

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