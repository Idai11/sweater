const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./misc/config");

const users = require("./views/users");
const user = require("./views/user");
const tokens = require("./views/tokens");

const app = express();
// Setup the JSON request parser
app.use(bodyParser.json());
// Set /static as staticfiles directory
app.use(express.static("static"));

// Connect to test database
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// URL Map
app.all("/api/users", users);
app.all("/api/users/:userId", user);
app.all("/api/tokens", tokens);

// Listen on port 3000
app.listen(config.port, () => console.log("Server listening on port 3000"));
