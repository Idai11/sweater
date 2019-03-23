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
        error: String

        tokens(count: Int = 10, offset: Int = 0): [Token]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
        updateUser(id: String!, firstName: String, lastName: String, email: String, password: String, old_password: String): User!
        deleteUser(id: String!): Boolean

        createToken(email: String!, password: String!): Token!
        deleteToken(id: String): Boolean
    }

    type User {
        _id: String!
        firstName: String
        lastName: String!
        email: String!
        password: String!
        salt: String!
        admin: Boolean!
    }

    type Token {
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
