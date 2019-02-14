const objectId = require("mongoose").Types.ObjectId;

const errors = require("./errors");

const userModel = require("../models/User.model");

const user = (req, res) => {
    const method = req.method.toUpperCase();
    const userId = req.params.userId;

    switch (method) {
        case "GET":
            userGet(req, res, userId);
            break;
        default:
            errors.methodNotAllowed(req, res);
    }
}

const userGet = (req, res, userId) => {
    try {
        const userObjId = objectId(userId);
        userModel.findOne({"_id": userObjId}, (err, user) => {
            if (err) {
                console.log(user);
                errors.databaseError(req, res, err);
            } else {
                if (user) {
                    user = user.toObject();
                    delete user.password;
                    delete user.salt;
                    res.json(user);
                } else {
                    errors.notFound(req, res, "User");
                }
            }
        });
    } catch {
        errors.invalidArguments(req, res, ["userId"]);
    }
}

module.exports = user;
