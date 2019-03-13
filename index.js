const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./misc/config");

const users = require("./views/users");
const user = require("./views/user");
const tokens = require("./views/tokens");
const token = require("./views/token");
const errors = require("./views/errors");
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
    // Allow origin
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Request logging
    console.log(`${req.method} request to ${req.url}`);

    // Pass authUser
    validator(req, res, authUser => {
        req.authUser = authUser;
        next();
    });
});

/*
URL MAP:
/api
    /users
        @POST
        /:userId
            @GET
            @PUT
            @DELETE
    /tokens
        @POST
        @DELETE
*/
app.all("/api/users", users);
app.all("/api/users/:userId", user);
app.all("/api/tokens", tokens);
app.all("/api/tokens/:tokenId", token);

// Catch 404s
app.use((req, res, next) => {
  res.status(404);
  errors.notFound(req, res, req.url);
})

// Listen on port 3000
app.listen(config.port, () => console.log("Server listening on port 3000"));
