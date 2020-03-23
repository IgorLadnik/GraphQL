const graphql = require('graphql');
const _ = require('lodash');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID
} = graphql;

// dummy data
let books = [
	{ name: "Aaa", genre: 'Fantasy', id: '1' },
	{ name: "Bbb", genre: 'Fantasy', id: '2' },
	{ name: "Ccc", genre: 'Sci-Fi', id: '3' },
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// code to get data from db / other source - this is resolver
				console.log(typeof(args.id)); // the type is actually string
				return _.find(books, { id: args.id });
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

/*
query {
  book(id: 2) {
    name
    genre
    id
  }
}
 */