const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./views/users");
const tokens = require("./views/tokens");

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

app.all("/api/users", users);
app.all("/api/tokens", tokens);

app.listen(3000, () => console.log("Server listening on port 3000"));
