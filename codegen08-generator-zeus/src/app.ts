import { Parser, TreeToTS } from 'graphql-zeus';
const fs = require('fs');

// const schemaFileContents = `
// type Query{
//     hello: String!
// }
// schema{
//     query: Query
// }
// `

const schemaFileContents = `
type User {
    id: Int!
    name: String
}

type Query {
    getUserById(id: Int!): String
}
`

const typeScriptDefinition = TreeToTS.resolveTree(Parser.parse(schemaFileContents));
fs.writeFileSync('typeScriptDefinition.ts_', typeScriptDefinition);
//console.log(`\n Typescript \n********************\n${typeScriptDefinition}\n********************\n`);

const jsDefinition = TreeToTS.javascript(Parser.parse(schemaFileContents));
fs.writeFileSync('jsDefinition.js_', jsDefinition);
console.log(`\n Javascript \n********************\n${jsDefinition}\n********************\n`);

console.log('end');

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