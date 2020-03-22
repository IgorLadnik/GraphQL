// const express = require('express');
// const graphqlHTTP = require('express-graphql');
// import {buildSchema, GraphQLSchema} from 'graphql';
// import { RequestInfo } from "express-graphql";

import { Person } from 'schema-dts';

const p: Person = {
    '@type': 'Person',
    name: 'Eve',
    affiliation: {
        '@type': 'School',
    }
};

(function main() {
    let str = p.name;
})();

