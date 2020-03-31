import _ from 'lodash';
import { GraphQLResolveInfo } from 'graphql';
import { GqlSchemaParser } from './gqlSchemaParser'

const strSchema = `
  type User {
    id: Int!
    name: String
  }

  type Query {
    getUserById(id: Int!): String
  }
`;

// Temp. data source
const users: Array<User> = [
  { id: 1, name: 'David Ben-Gurion' },
  { id: 2, name: 'Moshe Sharett' },
  { id: 3, name: 'Levi Eshkol' },
  { id: 4, name: 'Golda Meir' },
  { id: 5, name: 'Yitzhak Rabin' },
  { id: 6, name: 'Menachem Begin' }
];

export const gqlSchemaParser = new GqlSchemaParser(strSchema);

let userTypeObject = gqlSchemaParser.getObjectByTypeName('User').object;
let query = gqlSchemaParser.getObjectByTypeName('Query');

type User = typeof userTypeObject;

//type TypeUser = typeof userTypeObject;
// export class User implements TypeUser {
//   id: number;
//   name: string;
// }

export function AddResolversAfterStartListening() {
  gqlSchemaParser.addResolver(query.fieldNames[0],
      (parent: any, args: any, context: any, info: GraphQLResolveInfo) =>
          _.filter(users, user => user.id === parent.id)[0]?.name
  );
}