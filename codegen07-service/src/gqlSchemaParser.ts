import { parse, buildSchema, GraphQLSchema, GraphQLResolveInfo } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { codegen } from "@graphql-codegen/core";
import { TypeScriptSimple } from "typescript-simple";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import ts = require('typescript');
const path = require('path');
const fs = require('fs');


const tsCodePostProcessing = `
function tsCodePostProcessing() {
    class Query {
      getUserById: string;
      constructor(getUserById) {
        this.getUserById = getUserById;
      }
    };

    class QueryGetUserByIdArgs {
      id: number;
      constructor(id) {
        this.id = id;
      }
    };

    class User {  
      id: number;
      name: string;
      constructor(id, name) {
        this.id = id;
        this.name = name;
      }
    };

    return [ Query, QueryGetUserByIdArgs, User ];
}
`;

export type ResolverFn = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any;

export interface ResolverMap {
    [fieldName: string]: ResolverFn;
}

export class GqlSchemaParser {
    readonly schema: GraphQLSchema;
    generatedClasses: any;
    resolvers: ResolverMap = { };

    private readonly config: Types.GenerateOptions;
    private readonly strSchema: string;
    private readonly filePathWithoutExt: string;

    private currentCode: string;

    constructor(str: string, private isOutputToFile: boolean = false) {
        let strSchema = str;
        let interim = path.join(__dirname, '..');
        let outputDir = path.join(interim, 'output');
        let fileName: string;

        try {
            strSchema = fs.readFileSync(str, 'utf8');
            fileName = GqlSchemaParser.getFileNameWithoutExt(str);
        }
        catch {
            fileName = `${uuidv4()}`;
        }

        this.filePathWithoutExt = path.join(outputDir, fileName);

        this.strSchema = strSchema;

        this.schema = buildSchema(strSchema);
        this.config = {
            // used by a plugin internally, although the 'typescript' plugin currently
            // returns the string output, rather than writing to a file
            filename: `${this.filePathWithoutExt}.ts`,
            schema: parse(strSchema),
            plugins: [ // Each plugin should be an object
                {
                    typescript: { }, // Here you can pass configuration to the plugin
                },
            ],
            pluginMap: {
                typescript: typescriptPlugin,
                typescript_resolvers: typescriptPlugin,
            },
            documents: [],
            config: {
                //[key: string]: any;
            },
            skipDocumentsValidation: true
        };
    }

    async processSchema(): Promise<GqlSchemaParser> {
        this.generateInitTsCode();

        // generatedTsCode --> postProcessedTsCode
        this.tsCodePostProcessing();

        // postProcessedTsCode --> jsCode
        this.transpilation();

        // jsCode --> generatedClasses
        this.produceGeneratedClasses();

        return this;
    }

    setResolver(resolverName: string, fn: Function) {
        this.resolvers[resolverName] = (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
            try {
                return fn(parent, args, context, info);
            }
            catch (err) {
                console.log(`ERROR in resolver \"${resolverName}\": ${err}`);
                return null;
            }
        }
    }

    private async generateInitTsCode() {
        let genFile = path.join(this.config.filename);

        try {
            this.currentCode = await codegen(this.config);

            this.outputResultToFile('.ts', this.currentCode);
        }
        catch (err) {
            console.log(`ERROR in \"codegen\": ${err}`);
        }
    }

    // generatedTsCode --> postProcessedTsCode
    private tsCodePostProcessing() {
        // Not implemented yet
        this.currentCode = tsCodePostProcessing; //TEMP before gqlSchemaParser.tsCodePostProcessing() will be implemented
        this.outputResultToFile('-postprocessed.ts', this.currentCode);
    }

    // postProcessedTsCode -> jsCode
    private transpilation() {
        const tss = new TypeScriptSimple({ target: ts.ScriptTarget.ES2016 }, false);
        this.currentCode = tss.compile(this.currentCode);
        this.outputResultToFile('.js', this.currentCode);
    }

    // jsCode --> generatedClasses
    private produceGeneratedClasses() {
        const index = this.currentCode.indexOf('{');
        const jsStrFn = this.currentCode.substring(index, this.currentCode.length);
        let fn = new Function(jsStrFn);
        this.generatedClasses = fn();
    }

    private static getFileNameWithoutExt(filePath: string): string {
        let pathWitoutExt = filePath.split('.', 2)[0];
        let index = pathWitoutExt.lastIndexOf('\\');
        if (index === -1)
            index = pathWitoutExt.lastIndexOf('/');
        return pathWitoutExt.substring(index, pathWitoutExt.length);
    }

    private outputResultToFile(filePathSuffix: string, code: string) {
        if (this.isOutputToFile) {
            let filePath = `${this.filePathWithoutExt}${filePathSuffix}`;
            console.log(`\n${filePath}\n======================\n${code}\n======================\n`);
            fs.writeFileSync(filePath, code);
        }
    }
}
