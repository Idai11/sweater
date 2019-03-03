const config = require("../misc/config");

const errors = {};

/*
The request was sent to a path that doesn't allow the request's method
*/
errors.methodNotAllowed = (req, res) => {
    res.status(400);
    res.json({
        "error": true,
        "errorCode": 1,
        "errorMessage": "Method not allowed"
    });
}

/*
There was an error fetching or updating the database
*/
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

/*
There are missing arguments
OR Invalid arguments (for example: wrong type)
*/
errors.invalidArguments = (req, res, invalid) => {
    res.status(400);
    res.json({
        "error": true,
        "errorCode": 3,
        "errorMessage": "Invalid arguments",
        invalid
    });
}

/*
The client attempted to create a new user with a taken email
*/
errors.emailTaken = (req, res) => {
    res.status(400);
    res.json({
        "error": true,
        "errorCode": 4,
        "errorMessage": "Email address is already taken"
    });
}

/*
The auth token was invalid
*/
errors.loginFailed = (req, res) => {
    res.status(401);
    res.json({
        "error": true,
        "errorCode": 5,
        "errorMessage": "Authentication failed"
    });
}

/*
The user is unauthorized to do the action which he attempted to do
*/
errors.unauthorized = (req, res) => {
    res.status(401);
    res.json({
        "error": true,
        "errorCode": 6,
        "errorMessage": "You are not authorized to perform this action"
    });
}

/*
The page or object was not found
*/
errors.notFound = (req, res, name) => {
    res.status(404);
    res.json({
        "error": true,
        "errorCode": 7,
        "errorMessage": `${name} not found`
    });
}

module.exports = errors;
