const graphql = require('graphql');
const _ = require('lodash');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
} = graphql;

// dummy data
let books = [
	{ name: "Aaa", genre: 'Fantasy', id: '1', authorId: '1' },
	{ name: "Bbb", genre: 'Fantasy', id: '2', authorId: '2' },
	{ name: "Ccc", genre: 'Sci-Fi',  id: '3', authorId: '3' },
	{ name: "Ddd", genre: 'Fantasy', id: '4', authorId: '2' },
	{ name: "Eee", genre: 'Fantasy', id: '5', authorId: '3' },
	{ name: "Fff", genre: 'Sci-Fi',  id: '6', authorId: '3' },
];

let authors = [
	{ name: "author of Aaa", age: 41, id: '1' },
	{ name: "author of Bbb", age: 51, id: '2' },
	{ name: "author of Ccc", age: 61, id: '3' },
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return _.find(authors, { id: parent.authorId });
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return _.filter(books, {authorId: parent.id});
			}
		}
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
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return _.find(authors, { id: args.id });
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return books;
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authors;
			},
		},
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

/*

query {
  book(id: 3) {
    name
    genre
    author {
      name
      age
    }
  }
}

query {
  author(id: 3) {
    name
    age
    books {
      name
      genre
    }
  }
}

query {
  books {
    name
    genre
    author {
      name
    }
  }
}

query {
  authors {
    name
    age
    books {
      name
    }
  }
}

*/