/*
FILE: token.js
*/

const crypto = require("crypto");

const tokenModel = require("../models/Token.model");
const tokenMaker = require("../misc/tokens");
const userModel = require("../models/User.model");
const errors = require("./errors");

module.exports = resolvers => {
    resolvers.Query.tokens = async (root, {count, offset}, req) => {
        // Only admin users can view all tokens
        if (req.authUser && req.authUser.admin) {
            return await tokenModel.find({}, null, {limit: count, skip: offset}).exec();
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Query.token = async (root, {id}, req) => {
        if (req.authUser && req.authUser.admin) {
            return await tokenModel.findOne({_id: id}).exec();
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

            // Compare hashed password + salt against db
            // If successful create, save and return a new token
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
        // Delete can be called without a specific token
        // This will result in deleting the token used to make the request
        if (id == undefined) {
            id = req.headers.token;
        } else if (!(req.authUser && req.authUser.admin)) {
            throw errors.unauthorized();
        }

        if (id) {
            await tokenModel.deleteOne({_id: id});

            return true;
        } else {
            throw errors.missingArgs();
        }
    }

    resolvers.Token = {
        _id: token => token._id,
    }

    return resolvers;
}
