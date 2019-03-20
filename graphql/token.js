const crypto = require("crypto");

const tokenModel = require("../models/Token.model");
const tokenMaker = require("../misc/tokens");
const userModel = require("../models/User.model");
const errors = require("./errors");

module.exports = resolvers => {
    resolvers.Query.tokens = async (root, {count, offset}, req) => {
        if (req.authUser && req.authUser.admin) {
            return await tokenModel.find({}, null, {limit: count, skip: offset}).exec();
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Mutation.createToken = async (root, {email, password}, req) => {
        const user = await userModel.findOne({email});

        if (user) {
            const hashedPassword = crypto
                .createHash("sha512")
                .update(password + user.salt)
                .digest("base64");

            if (hashedPassword === user.password) {
                const token = new tokenModel({
                    _id: tokenMaker.make(user)
                });

                return await token.save();
            } else {
                throw errors.authFail();
            }
        } else {
            throw errors.authFail();
        }
    }

    resolvers.Mutation.deleteToken = async (root, {id}, req) => {
        if (id == undefined) {
            id = req.headers.token;
        } else if (!(req.authUser && req.authUser.admin)) {
            throw errors.unauthorized();
        }

        if (id) {
            await tokenModel.deleteOne({_id: id});

            return null;
        } else {
            throw errors.missingArgs();
        }
    }

    resolvers.Token = {
        _id: token => token._id,
    }

    return resolvers;
}
