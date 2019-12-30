const express = require("express");
const graphqlExpress = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const schema = require("./graphql/schema");
const config = require("./misc/config");

const validator = require("./misc/authValidator");

const app = express();
// Setup app with CORS policy
app.use(cors());
// Set /static as staticfiles directory
app.use(express.static("static"));

// Connect to test database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

// Pre-Request middleware
app.use((req, res, next) => {
    // Pass authUser
    validator(req, res, authUser => {
        req.authUser = authUser;
        next();
    });
});

// GraphQL Endpoint
app.use("/graphql", graphqlExpress({
    schema: schema,
    graphiql: true,
    formatError: error => {
        const content = error.message.split("\n");
        return {
            message: content[0],
            code: parseInt(content[1])
        }
    }
}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/html/landing.html");
});

// Catch 404s
app.use((req, res, next) => {
  res.status(404);
  res.end();
})

// Listen on port 3000
app.listen(config.port, () => console.log("Server listening on port 3000"));
