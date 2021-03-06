/*
FILE: schema.js
*/

const { buildSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");

const userPlug = require("./user");
const tokenPlug = require("./token");
const potPlug = require("./pot");
const plantPlug = require("./plants");

// The plugs contain the functions relevant to their topics
// userPlug contains all the functions that relate to the user model
const plugs = [
    userPlug,
    tokenPlug,
    plantPlug,
    potPlug
]

// Below are all the functions the server is capable of executing
// The input of the function is inside the parentheses ()
// Output is described after the colon :
// Exclamation mark ! means that the field is required
// Equals = sets a default value
const typeDefs = `
    type Query {
        # Get a list of all users
        users(count: Int = 10, offset: Int = 0): [User]!
        # Get a specific user
        user(id: String!): User!
        # Get your user
        me: User!

        # Get a list of all tokens
        tokens(count: Int = 10, offset: Int = 0): [Token]!
        # Get a specific token
        token(id: String!): Token!

        # Get plant data for a single plant type
        plant(name: String!): Plant!

        # Get a specific pot
        pot(id: String!): Pot!
        # Get a list of all pots related to your user
        my_pots: [Pot]!
    }

    type Mutation {
        # Create a new user
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
        # Update existing user info
        updateUser(id: String!, firstName: String, lastName: String, email: String, password: String, old_password: String): User!
        # Delete existing user
        deleteUser(id: String!): Boolean

        # Create a new auth token
        createToken(email: String!, password: String!): Token!
        # Delete an existing auth token
        deleteToken(id: String): Boolean

        # Create a new pot
        createPot(name: String!): Pot!
        # Update the sensor data in the pot
        addData(id: String!, moisture: Int!, light: Int!): Pot!
        # Update pot info
        updatePot(id: String!, name: String, imgUrl: String, plant: String, plantDate: String): Pot!
        # Delete an existing pot
        deletePot(id: String!): Boolean
    }

    type User {
        _id: String!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        salt: String!
        admin: Boolean!
    }

    type Token {
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

// The plugs are PLUGGED into a single object containing all the resolvers (functions)
for (let plug of plugs) {
    resolvers = plug(resolvers);
}

// This function makes a GraphQL schema using the above function defenition (typeDefs)
// and all the plugs combined (resolvers)
// see index.js for the use of this schema
module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});
