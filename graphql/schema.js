const { buildSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");

const userPlug = require("./user");
const tokenPlug = require("./token");
const potPlug = require("./pot");
const plantPlug = require("./plants");

const plugs = [
    userPlug,
    tokenPlug,
    plantPlug,
    potPlug
]

const typeDefs = `
    type Query {
        users(count: Int = 10, offset: Int = 0): [User]!
        user(id: String!): User!
        me: User!

        tokens(count: Int = 10, offset: Int = 0): [Token]!
        token(id: String!): Token!

        plant(name: String!): Plant!

        pot(id: String!): Pot!
        my_pots: [Pot]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
        updateUser(id: String!, firstName: String, lastName: String, email: String, password: String, old_password: String): User!
        deleteUser(id: String!): Boolean

        createToken(email: String!, password: String!): Token!
        deleteToken(id: String): Boolean

        createPot(name: String!): Pot!
        addData(id: String!, moisture: Int!, light: Int!): Pot!
        updatePot(id: String!, name: String, imgUrl: String, plant: String, plantDate: String): Pot!
        deletePot(id: String!): Boolean
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

    type Pot {
        _id: String!
        name: String!
        imgUrl: String
        plant: String
        plantDate: String
        lightHours: [Int]
        moisture: Int
        waterLevel: Int
        owner: User!
    }

    type Plant {
        water: Duration!
        light: Range!
        harvestTime: Range!
        plant_time: Range!
        distance: Int!
        notes: [String!]
    }

    type Range {
        min: Int
        max: Int
    }

    type Duration {
        day: Int
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
