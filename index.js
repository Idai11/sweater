/*
FILE: index.js
*/

// External packages (see package.json)
const express = require("express"); // HTTP request handling
const graphqlExpress = require("express-graphql"); // GraphQL request handling
const mongoose = require("mongoose"); // Using MongoDB database
const bodyParser = require("body-parser"); // Parser for request body (headers for example)
const cors = require("cors"); // Comply with CORS policy (illegal request blocker)

const schema = require("./graphql/schema");
const config = require("./misc/config");

const validator = require("./misc/authValidator");

const app = express();
// Setup app with CORS policy
app.use(cors());
// Set /static as staticfiles directory
app.use(express.static("static"));

// Connect to test database
URI_OOPSI = "mongodb://idai:hQc2kkQVWiNNeKX2@sweater-shard-00-00-3jew7.mongodb.net:27017,sweater-shard-00-01-3jew7.mongodb.net:27017,sweater-shard-00-02-3jew7.mongodb.net:27017/test?ssl=true&replicaSet=sweater-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(URI_OOPSI, {useNewUrlParser: true});

// Pre-Request middleware
// This happens to every request before it's passed to the other parts of the server
app.use((req, res, next) => {
    // Pass the request to the validator (see authValidator.js)
    validator(req, res, authUser => {
        // This adds the authUser value to the request, which is the user that made the request
        // req.authUser is used in all the GraphQL Plugs (pot.js, token.js, user.js)
        req.authUser = authUser;
        next();
    });
});

// GraphQL Endpoint
app.use("/graphql", graphqlExpress({
    schema: schema, // What schema to use to parse requests (see schema.js)
    formatError: error => { // What to return in case of error
        const content = error.message.split("\n");
        return {
            message: content[0],
            code: parseInt(content[1])
        }
    }
}));

// HTML landing page (to check if site is up)
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/html/landing.html");
});

// Catch 404s
app.use((req, res, next) => {
    // Return empty response with 404 code
    res.status(404);
    res.end();
})

// Listen on port from env
app.listen(config.port, () => console.log(`Server listening on port ${config.port}`));
