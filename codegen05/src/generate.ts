import _ from 'lodash';
import { GraphQLResolveInfo } from 'graphql';
import { GqlSchemaParser, ResolverMap } from './gqlSchemaParser'

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

const gqlSchemaParser = new GqlSchemaParser(strSchema);
export const schema = gqlSchemaParser.schema;

let userTypeObject = gqlSchemaParser.getObjectByTypeName('User').object;
let query = gqlSchemaParser.getObjectByTypeName('Query');

type User = typeof userTypeObject;

export const resolvers: ResolverMap = { }; 

AddResolvers(query.fieldNames, resolvers);

// // TEMP
// export class User implements TypeUser {
//   id: number;
//   name: string;
// } 

function AddResolvers(resolverNames: Array<string>, resolvers: ResolverMap) {
  // const resolvers: ResolverMap = {
  //     getUserById(parent: any, args: any, context: any, info: GraphQLResolveInfo) {
  //         try {
  //             return _.filter(users, user => user.id === parent.id)[0]?.name;
  //         }
  //         catch (err) {
  //             console.log(`Error in \"user\" resolver: ${err}`);
  //             return null;
  //         }
  //     }
  // };
  for (let i = 0; i < resolverNames.length; i++) {
    switch (resolverNames[i]) {
      case 'getUserById':
        resolvers[`${resolverNames[i]}`] = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
          try {
              return _.filter(users, user => user.id === parent.id)[0]?.name;
          }
          catch (err) {
              console.log(`Error in \"user\" resolver: ${err}`);
              return null;
          }
        }
        break;
    }
  } 
}