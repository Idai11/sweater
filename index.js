const express = require("express");

const app = express();

app.get("/api/users", (req, res) => {
    res.send("Get users here!");
});

app.listen(3000, () => console.log("Server listening on port 3000"));
