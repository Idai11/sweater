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

module.exports = errors;
