import { parse, buildSchema, GraphQLResolveInfo } from "graphql";

const strSchema = `
  type User {
    id: Int!
    name: String
  }

  type Query {
    getUserById(id: Int!): String
  }
`;

const user = getTypeObjFromSchema(strSchema, 'User');
export type User = typeof user;
export const schema = buildSchema(strSchema);

export const resolverNames = parseQueryFields(getTypeObjFromSchema(strSchema, 'Query'));

export type ResolverFn = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any;

export interface ResolverMap {
  [fieldName: string]: ResolverFn;
}

function getTypeObjFromSchema(strSchema: string, typeName: string): any {
    let generatedSchema = parse(strSchema);
    let theTypeObj: any;
    for (let i = 0; i < generatedSchema.definitions.length; i++) {
        theTypeObj = generatedSchema.definitions[i];
        if (theTypeObj.name.value === typeName)
            return theTypeObj;
    }

    return null;
}

function parseQueryFields(query: any): Array<string> {
  let resolverNames = Array<string>();
  for (let i = 0; i < query.fields.length; i++) {
    const field = query.fields[i];
    resolverNames.push(field.name.value);
  }

  return resolverNames;
}