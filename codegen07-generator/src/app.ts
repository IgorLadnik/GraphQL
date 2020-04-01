import { GqlSchemaParser } from './gqlSchemaParser';

(async function main() {
    const filePath = process.argv[2];
    const gqlSchemaParser = await new GqlSchemaParser(filePath).generate();
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