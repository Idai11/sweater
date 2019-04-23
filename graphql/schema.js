const { buildSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");

const userPlug = require("./user");
const tokenPlug = require("./token");

const plugs = [
    userPlug,
    tokenPlug
]

const typeDefs = `
    type Query {
        users(count: Int = 10, offset: Int = 0): [User]!
        user(id: String!): User!
        me: User!

        tokens(count: Int = 10, offset: Int = 0): [Token]!
        token(id: String!): Token!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
        updateUser(id: String!, firstName: String, lastName: String, email: String, password: String, old_password: String): User!
        deleteUser(id: String!): Boolean

        createToken(email: String!, password: String!): Token!
        deleteToken(id: String): Boolean
    }

    type User {
        """Uneditable"""
        _id: String!
        """Editable"""
        firstName: String!
        """Editable"""
        lastName: String!
        """Editable"""
        email: String!
        """Password"""
        password: String!
        """Uneditable"""
        salt: String!
        """Editable"""
        admin: Boolean!
    }

    type Token {
        """Uneditable"""
        _id: String!
    }
`;

let resolvers = {
    Query: {},
    Mutation: {}
};
for (let plug of plugs) {
    resolvers = plug(resolvers);
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});
