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

const user = getTypeObjFromSchema(strSchema, 'User');
export type User = typeof user;
export const schema = buildSchema(strSchema);

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