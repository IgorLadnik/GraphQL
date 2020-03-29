import _ from 'lodash';
import { parse, buildSchema, GraphQLResolveInfo, GraphQLSchema } from "graphql";

export type ResolverFn = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any;

export interface ResolverMap {
  [fieldName: string]: ResolverFn;
}

export class GqlSchemaParserResult {
    public name: string;
    public object: any;
    public fieldNames: Array<string>;
}

export class GqlSchemaParser {
    public schema: GraphQLSchema;
    public results = new Array<GqlSchemaParserResult>(); 

    constructor(strSchema: string) {
        this.schema = buildSchema(strSchema);
        let generatedSchema = parse(strSchema);
        let theTypeObj: any;
        for (let i = 0; i < generatedSchema.definitions.length; i++) {
            theTypeObj = generatedSchema.definitions[i];
            let result = new GqlSchemaParserResult();
            result.name = theTypeObj.name.value;
            result.object = theTypeObj;
            result.fieldNames = GqlSchemaParser.parseQueryFields(theTypeObj);
            this.results.push(result);
        }
    }

    private static parseQueryFields(query: any): Array<string> {
        let resolverNames = Array<string>();
        for (let i = 0; i < query.fields.length; i++) {
            const field = query.fields[i];
            resolverNames.push(field.name.value);
        }

        return resolverNames;
    }

    public getObjectByTypeName = (typeName: string): GqlSchemaParserResult =>
        _.filter(this.results, r => r.name === typeName)[0];
}