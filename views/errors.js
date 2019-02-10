const errors = {};

errors.methodNotAllowed = (req, res) => {
    res.status(400);
    res.json({
        "message": "Method not allowed"
    });
}

errors.databaseError = (req, res) => {
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

module.exports = errors;
