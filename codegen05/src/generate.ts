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
export type User = typeof user;
export const schema = buildSchema(strSchema);

export const resolverNames = GqlSchemaParser.parseQueryFields(GqlSchemaParser.getTypeObjFromSchema(strSchema, 'Query'));
