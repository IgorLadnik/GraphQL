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


(async function main() {
    const gqlSchemaParser = await new GqlSchemaParser(inputStrSchema).processSchema();

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