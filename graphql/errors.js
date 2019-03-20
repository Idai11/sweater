const errors = {};

errors.databaseError = () => {
    return Error("Database Error")
}

errors.emailTaken = () => {
    return Error("The email address is already taken")
}

errors.missingArgs = () => {
    return Error("Some required arguments are missing")
}

errors.authFail = () => {
    return Error("Authentication failed");
}

errors.unauthorized = () => {
    return Error("You are not authorized to perform this action")
}

module.exports = errors;
