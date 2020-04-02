import { parse, buildSchema, GraphQLSchema } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { codegen } from "@graphql-codegen/core";
import { TypeScriptSimple } from "typescript-simple";
import { v4 as uuidv4 } from 'uuid';
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

    currentCode: string;
    generatedClasses: any;

    private readonly strSchema: string;
    private readonly filePathWithoutExt: string;

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
        //console.log(`\nInitial Generated TS Code\n======================\n${this.generatedTsCode}\n======================\n`);

        // generatedTsCode --> postProcessedTsCode
        this.tsCodePostProcessing();
        //this.postProcessedTsCode = tsCodePostProcessing; //TEMP before gqlSchemaParser.tsCodePostProcessing() will be implemented
        //console.log(`\nPost-processed TS Code\n======================\n${this.postProcessedTsCode}\n======================\n`);

        // postProcessedTsCode --> jsCode
        this.transpilation();
        //console.log(`\nJS Code\n======================\n${this.jsCode}\n======================\n`);

        // jsCode --> generatedClasses
        this.produceGeneratedClasses();

        return this;
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
