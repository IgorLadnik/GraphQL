import { parse, buildSchema, GraphQLResolveInfo } from 'graphql';
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

const user = GqlSchemaParser.getTypeObjFromSchema(strSchema, 'User');
type TypeUser = typeof user;
export const schema = buildSchema(strSchema);

export const resolverNames = GqlSchemaParser.parseQueryFields(GqlSchemaParser.getTypeObjFromSchema(strSchema, 'Query'));

export class User implements TypeUser {
  id: number;
  name: string;
} 
