const errors = require("./errors");
const tokenMaker = require("../misc/tokens");
const validator = require("../misc/authValidator");

const tokenModel = require("../models/Token.model");

const token = (req, res, tokenId) => {
    const method = req.method.toUpperCase();

    switch (method) {
        case "DELETE":
            tokenDelete(req, res, tokenId);
            break;
        case "OPTIONS":
            res.status(200);
            res.end();
            break;
        default:
            errors.methodNotAllowed(req, res);
            break;
    }
}

/*
Deletes a token (log out)
LOGIN REQUIRED!
REQUIRES:
    tokenId (url param)
RETURNS:
    nothing
*/
const tokenDelete = (req, res, tokenId) => {
    const token = typeof(req.headers.token) == "string" ? req.headers.token : false;

    var id = "";
    if (tokenId == "me" && req.authUser.email) {
        id = token;
    } else if (req.authUser.admin) {
        id = tokenId;
    } else {
        errors.unauthorized(req, res);
        return;
    }

    tokenModel.deleteOne({"_id": token}, err => {
        if (err) {
            errors.databaseError(req, res, err);
        } else {
            res.status(204);
            res.json();
        }
    });
}

module.exports = token;
