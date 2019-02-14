const config = require("../misc/config");

const errors = {};

errors.methodNotAllowed = (req, res) => {
    res.status(400);
    res.json({
        "message": "Method not allowed"
    });
}

errors.databaseError = (req, res, err) => {
    if (config.debug) {
        console.log(err);
    }

    res.status(500);
    res.json({
        "message": "Database error"
    });
}

errors.invalidArguments = (req, res, invalid) => {
    res.status(400);
    res.json({
        "message": "Invalid arguments",
        invalid
    });
}

errors.emailTaken = (req, res) => {
    res.status(400);
    res.json({
        "message": "Email address is already taken"
    });
}

errors.loginFailed = (req, res) => {
    res.status(401);
    res.json({
        "message": "Authentication failed"
    });
}

errors.notFound = (req, res, name) => {
    res.status(404);
    res.json({
        "message": `${name} not found`
    });
}

module.exports = errors;
