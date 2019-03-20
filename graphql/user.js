const objId = require("mongoose").Types.ObjectId;
const crypto = require("crypto");

const fieldValidator = require("../misc/fieldValidator");
const stringers = require("../misc/stringers");
const userModel = require("../models/User.model");
const errors = require("./errors");

module.exports = resolvers => {
    resolvers.Query.users = async (root, {count, offset}, req) => {
        if (req.authUser && req.authUser.admin) {
            return await userModel.find({}, null, {limit: count, skip: offset}).exec();
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Query.user = async (root, {id}, req) => {
        const user = await userModel.findOne({_id: objId(id)}).exec();
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(user._id))) {
            return user;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Query.me = (root, args, req) => {
        if (req.authUser) {
            return req.authUser;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Mutation.createUser = async (root, {firstName, lastName, password, email}) => {
        if (fieldValidator.stringValidator([firstName, lastName, password, email], {
                                            min_length: 1,
                                            max_length: 63
                                        })) {
            const salt = stringers.generateRandomString(5);
            const hashedPassword = crypto
                .createHash("sha512")
                .update(password + salt)
                .digest("base64");

            const user = new userModel({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                salt,
                admin: false
            });

            return await user.save();
        } else {
            throw errors.missingArgs();
        }
    }

    resolvers.Mutation.updateUser = async (root, {id, firstName, lastName, password, old_password, email}, req) => {
        const user = await userModel.findOne({_id: objId(id)}).exec();
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(user._id))) {
            const options = {
                min_length: 1,
                max_length: 63
            };

            if (fieldValidator.stringValidator([old_password, password], options)) {
                const hashedOld = crypto
                    .createHash("sha512")
                    .update(old_password + user.salt)
                    .digest("base64");

                if (hashedOld == user.password) {
                    user.password = crypto
                        .createHash("sha512")
                        .update(password + user.salt)
                        .digest("base64");
                } else {
                    throw errors.missingArgs();
                }
            }

            if (fieldValidator.stringValidator([firstName], options)) {
                user.firstName = firstName;
            }

            if (fieldValidator.stringValidator([lastName], options)) {
                user.lastName = lastName;
            }

            if (fieldValidator.stringValidator([email], options)) {
                user.email = email;
            }

            return await user.save();
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Mutation.deleteUser = async (root, {id}, req) => {
        const user = await userModel.findOne({_id: objId(id)}).exec();
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(user._id))) {
            await user.remove();
            return null;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.User = {
        _id: user => user._id,
        firstName: user => user.firstName,
        lastName: user => user.lastName,
        password: user => user.password,
        salt: user => user.salt,
        admin: user => user.admin
    }

    return resolvers;
}
