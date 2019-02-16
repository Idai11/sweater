const config = require("../misc/config");

const errors = {};

errors.methodNotAllowed = (req, res) => {
    res.status(400);
    res.json({
        "error": true,
        "errorCode": 1,
        "errorMessage": "Method not allowed"
    });
}

errors.databaseError = (req, res, err) => {
    if (config.debug) {
        console.log(err);
    }

    res.status(500);
    res.json({
        "error": true,
        "errorCode": 2,
        "errorMessage": "Database error"
    });
}

errors.invalidArguments = (req, res, invalid) => {
    res.status(400);
    res.json({
        "error": true,
        "errorCode": 3,
        "errorMessage": "Invalid arguments",
        invalid
    });
}

errors.emailTaken = (req, res) => {
    res.status(400);
    res.json({
        "error": true,
        "errorCode": 4,
        "errorMessage": "Email address is already taken"
    });
}

errors.loginFailed = (req, res) => {
    res.status(401);
    res.json({
        "error": true,
        "errorCode": 5,
        "errorMessage": "Authentication failed"
    });
}

errors.unauthorized = (req, res) => {
    res.status(401);
    res.json({
        "error": true,
        "errorCode": 6,
        "errorMessage": "You are not authorized to perform this action"
    });
}

errors.notFound = (req, res, name) => {
    res.status(404);
    res.json({
        "error": true,
        "errorCode": 7,
        "errorMessage": `${name} not found`
    });
}

module.exports = errors;
