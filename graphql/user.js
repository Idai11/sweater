/*
FILE: user.js
*/

const objId = require("mongoose").Types.ObjectId;
const crypto = require("crypto");

const fieldValidator = require("../misc/fieldValidator");
const stringers = require("../misc/stringers");
const userModel = require("../models/User.model");
const errors = require("./errors");

module.exports = resolvers => {
    resolvers.Query.users = async (root, {count, offset}, req) => {
        // Only admins can get a list of all users
        if (req.authUser && req.authUser.admin) {
            return await userModel.find({}, null, {limit: count, skip: offset}).exec();
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Query.user = async (root, {id}, req) => {
        const user = await userModel.findOne({_id: objId(id)}).exec();
        // If the user is admin or the requested user
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
                                            max_length: 100
                                        })) {
            // Generate a random salt with length 5
            const salt = stringers.generateRandomString(5);
            // Hash password with salt
            const hashedPassword = crypto
                .createHash("sha512")
                .update(password + salt)
                .digest("base64");

            // Create a new user
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
                max_length: 100
            };

            // Changing password
            if (fieldValidator.stringValidator([old_password, password], options)
                    || (fieldValidator.stringValidator([password], options) && req.authUser.admin)) {
                const hashedOld = crypto
                    .createHash("sha512")
                    .update(old_password + user.salt)
                    .digest("base64");

                // Check that old password is correct
                if (hashedOld == user.password) {
                    user.password = crypto
                        .createHash("sha512")
                        .update(password + user.salt)
                        .digest("base64");
                } else {
                    throw errors.authFail();
                }
            }

            // Change first name
            if (fieldValidator.stringValidator([firstName], options)) {
                user.firstName = firstName;
            }

            // Change last name
            if (fieldValidator.stringValidator([lastName], options)) {
                user.lastName = lastName;
            }

            // Change email
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
        // Only an admin or the user itself can delete a user
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(user._id))) {
            await user.remove();
            return true;
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
