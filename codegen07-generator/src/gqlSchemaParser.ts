import { parse, buildSchema, GraphQLSchema } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { codegen } from "@graphql-codegen/core";
import { TypeScriptSimple } from "typescript-simple";
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

    return { Query, QueryGetUserByIdArgs, User };
}
`;


export class GqlSchemaParser {
    readonly schema: GraphQLSchema;
    readonly config: Types.GenerateOptions;

    generatedTsCode: string;
    postProcessedTsCode: string;
    jsCode: string;
    generatedClasses: any;

    private readonly strSchema: string;

    constructor(str: string, private isOutputToFile: boolean = false) {
        let strSchema = str;
        let outputFile = `generated-schema.ts`;

        try {
            strSchema = fs.readFileSync(str, 'utf8');
            outputFile = GqlSchemaParser.getOutputFileName(str);
        }
        catch { }

        this.strSchema = strSchema;

        this.schema = buildSchema(strSchema);
        this.config = {
            // used by a plugin internally, although the 'typescript' plugin currently
            // returns the string output, rather than writing to a file
            filename: outputFile,
            schema: parse(strSchema),
            plugins: [ // Each plugin should be an object
                {
                    typescript: { }, // Here you can pass configuration to the plugin
                },
            ],
            pluginMap: {
                typescript: typescriptPlugin,
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
        console.log(`\nInitial Generated TS Code\n======================\n${this.generatedTsCode}\n======================\n`);

        // generatedTsCode --> postProcessedTsCode
        this.tsCodePostProcessing();
        this.postProcessedTsCode = tsCodePostProcessing; //TEMP before gqlSchemaParser.tsCodePostProcessing() will be implemented
        console.log(`\nPost-processed TS Code\n======================\n${this.postProcessedTsCode}\n======================\n`);

        // postProcessedTsCode --> jsCode
        this.transpilation();
        console.log(`\nJS Code\n======================\n${this.jsCode}\n======================\n`);

        // jsCode --> generatedClasses
        this.produceGeneratedClasses();

        return this;
    }

    private async generateInitTsCode() {
        let genFile = path.join(this.config.filename);

        try {
            this.generatedTsCode = await codegen(this.config);

            if (this.isOutputToFile)
                fs.writeFileSync(GqlSchemaParser.getOutputFileName(genFile), this.generatedTsCode);
        }
        catch (err) {
            console.log(`ERROR in \"codegen\": ${err}`);
        }
    }

    // generatedTsCode --> postProcessedTsCode
    private tsCodePostProcessing() {
        // Not implemented yet
    }

    // jsCode --> generatedClasses
    private transpilation() {
        const tss = new TypeScriptSimple({ target: ts.ScriptTarget.ES2016 }, false);
        this.jsCode = tss.compile(this.postProcessedTsCode);
    }

    // jsCode --> generatedClasses
    private produceGeneratedClasses() {
        const index = this.jsCode.indexOf('{');
        const jsStrFn = this.jsCode.substring(index, this.jsCode.length);
        let fn = new Function(jsStrFn);
        this.generatedClasses = fn();
    }

    private static getOutputFileName = (fileName: string): string =>
        `${fileName.split('.', 2)[0]}.ts`
}