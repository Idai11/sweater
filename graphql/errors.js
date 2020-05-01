/*
FILE: errors.js
*/

const errors = {};

// Pre written errors to maintain consistency

// Code: 1
errors.databaseError = () => {
    return Error("Database Error\n1");
}

// Code: 2
errors.emailTaken = () => {
    return Error("The email address is already taken\n2");
}

// Code: 3
errors.missingArgs = () => {
    return Error("Some required arguments are missing\n3");
}

// Code: 4
errors.authFail = () => {
    return Error("Authentication failed\n4");
}

// Code: 5
errors.unauthorized = () => {
    return Error("You are not authorized to perform this action\n5");
}

module.exports = errors;
