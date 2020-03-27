import { parse, buildSchema } from "graphql";

const strSchema = `
  type User {
    id: Int!
    name: String
  }

  type Query {
    user(id: Int!): String
  }
`;

export type User = getTypeFromSchema(strSchema, 'User');
export const schema = buildSchema(strSchema);

function getTypeFromSchema(strSchema: string, typeName: string): any {
    let generatedSchema = parse(strSchema);
    let theTypeObj: any;
    for (let i = 0; i < generatedSchema.definitions.length; i++) {
        theTypeObj = generatedSchema.definitions[i];
        if (theTypeObj.name.value === typeName)
            return theTypeObj;
    }

    return null;
}