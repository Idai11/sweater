const express = require("express");
const graphqlExpress = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const schema = require("./graphql/schema");
const config = require("./misc/config");

const validator = require("./misc/authValidator");

const app = express();
// Setup the JSON request parser
app.use(bodyParser.json());
// Set /static as staticfiles directory
app.use(express.static("static"));

// Connect to test database
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// Pre-Request middleware
app.use((req, res, next) => {
    // Pass authUser
    validator(req, res, authUser => {
        req.authUser = authUser;
        next();
    });
});

app.use("/graphql", graphqlExpress({
    schema: schema,
    graphiql: true
}));

// Catch 404s
app.use((req, res, next) => {
  res.status(404);
  res.end();
})

// Listen on port 3000
app.listen(config.port, () => console.log("Server listening on port 3000"));
