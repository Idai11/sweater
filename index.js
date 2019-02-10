const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./views/users");

const app = express();

<<<<<<< HEAD
app.get("/", (req, res) => {
    res.send("Hello world!");
});
=======
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

app.all("/api/users", users);
>>>>>>> a6e321778e46964e27a676f56ff4305fd80b4ccb

app.listen(3000, () => console.log("Server listening on port 3000"));
