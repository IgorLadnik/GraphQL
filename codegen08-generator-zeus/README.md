So far I was able to write only off-line app. to generate TS types out of schema.
https://github.com/IgorLadnik/GraphQL/tree/master/codegen07-generator

This is based on this code generator: https://graphql-code-generator.com/
and its programmatic usage: https://graphql-code-generator.com/docs/getting-started/programmatic-usage

To run it:

npm install
tsc
start.cmd // it has sample __schema.txt file as parameter. Output file __schema.ts will be generated.

The problem to integrate it into service is followng.
Output TS files implies statis import. 
I was not able (probably because lack of knowledle in TS/JS field) to adaquately transpile it to JS file.

I will try to find some others GQL code generators - may be they produce JS code that can be imported dynamically by service.
