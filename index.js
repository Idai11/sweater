const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./misc/config");

const users = require("./views/users");
const user = require("./views/user");
const tokens = require("./views/tokens");

const app = express();
app.use(bodyParser.json());
app.use(express.static("static"));

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

app.all("/api/users", users);
app.all("/api/users/:userId", user);
app.all("/api/tokens", tokens);

app.listen(config.port, () => console.log("Server listening on port 3000"));
