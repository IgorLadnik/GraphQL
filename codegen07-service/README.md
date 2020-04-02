Assume that we have GQL schema as string (file generate.ts):

const strSchema = `
  type User {
    id: Int!
    name: String
  }

  type Query {
    getUserById(id: Int!): String
  }
`;


# File gqlSchemaParser.ts

Class GqlSchemaParser parses in its constructor the schema string and gets out of its
schema: GraphQLSchema; and
results: Array<GqlSchemaParserResult>;
where 

export class GqlSchemaParserResult {
    public name: string;
    public object: any;
    public fieldNames: Array<string>;
}

Here
object: any;
may be used to get generated type.


# File generate.ts

E.g. generated type User we can get as follows:

const gqlSchemaParser = new GqlSchemaParser(strSchema);
let userTypeObject = gqlSchemaParser.getObjectByTypeName('User').object;
type User = typeof userTypeObject;

If required we can use this type as interface.
This is commented out fragment, assuming that in this case generated type is TypeUser

// // TEMP
// export class User implements TypeUser {
//   id: number;
//   name: string;
// }

function AddResolvers(resolverNames: Array<string>, resolvers: ResolverMap)

manually adds actual resolvers to query's fields.


# File app.ts

Is is interesting that it seems the resolvers may be added after start listening, i.e. "at runtime".


# app may me tested with

GraphiQL:

http://localhost:3000/graphql

query {
  getUserById(id: 5)
}

and

Postman - HTTP POST

http://localhost:3000/graphql

Body -> GraphQL:

query {
  getUserById(id: 5)
}
