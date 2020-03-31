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
    public readonly schema: GraphQLSchema;
    public readonly resolvers: ResolverMap = { };
    private readonly results = new Array<GqlSchemaParserResult>();

    constructor(strSchema: string) {
        this.schema = buildSchema(strSchema);
        let generatedSchema = parse(strSchema);
        for (let i = 0; i < generatedSchema.definitions.length; i++) {
            let theTypeObj: any = generatedSchema.definitions[i];
            this.results.push({
                name: theTypeObj.name.value,
                object: theTypeObj,
                fieldNames: GqlSchemaParser.parseQueryFields(theTypeObj)
            });
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

    getObjectByTypeName = (typeName: string): GqlSchemaParserResult =>
        _.filter(this.results, r => r.name === typeName)[0];

    addResolver(resolverName: string, fn: Function) {
        this.resolvers[resolverName] = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            try {
                return fn(parent, args, context, info);
            }
            catch (err) {
                console.log(`Error in resolver \"${resolverName}\": ${err}`);
                return null;
            }
        }
    }
}