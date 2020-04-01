import { parse, buildSchema, GraphQLSchema } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { codegen } from "@graphql-codegen/core";
const path = require('path');
const fs = require('fs');

export class GqlSchemaParser {
    readonly schema: GraphQLSchema;
    readonly config: Types.GenerateOptions;

    private generatedModuleText: string;

    constructor(str: string) {
        let strSchema = str;
        let outputFile = `generated-schema.ts`;

        try {
            strSchema = fs.readFileSync(str, 'utf8');
            outputFile = GqlSchemaParser.getOutputFileName(str);
        }
        catch { }

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

    async generate(): Promise<GqlSchemaParser> {
        let genFile = path.join(this.config.filename);

        try {
            this.generatedModuleText = await codegen(this.config);
            fs.writeFileSync(genFile, this.generatedModuleText);
        }
        catch (err) {
            console.log(`ERROR in \"codegen\": ${err}`);
        }

        return this;
    }

    private static getOutputFileName = (fileName: string): string =>
        `${fileName.split('.', 2)[0]}.ts`
}