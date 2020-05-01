/*
FILE: pot.js
*/

const errors = require("./errors");
const potModel = require("../models/Pot.model");
const fieldValidator = require("../misc/fieldValidator")

module.exports = resolvers => {
    resolvers.Query.pot = async (root, {id}, req) => {
        const pot = await potModel.findOne({_id: id}).exec();

        // If user is authed and owner of the pot
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(pot.owner._id))) {
            return pot;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Query.my_pots = async (root, {count, offset}, req) => {
        if (req.authUser) {
            const pots = await potModel.find({owner: req.authUser}).exec();
            return pots;
        } else {
            throw errors.unauthorized();
        }
    }

    resolvers.Mutation.createPot = async (root, {name}, req) => {
        if (fieldValidator.stringValidator([name], {min_length: 1, max_length: 100})) {
            if (req.authUser) {
                const pot = new potModel({
                    name,
                    owner: req.authUser
                })

                return await pot.save();
            } else {
                throw errors.unauthorized();
            }
        } else {
            throw errors.missingArgs();
        }
    }

    resolvers.Mutation.addData = async (root, {id, moisture, light}, req) => {
        if (fieldValidator.intValidator([moisture, light])) {
            pot = await potModel.findOne({_id: id}).exec();
            if (pot && (req.authUser.admin || pot.owner._id.equals(req.authUser._id))) {
                // Update current moisture
                pot.moisture = moisture;

                // Store last 8 values of light
                // If there are already 8 values, delete the first one
                if (pot.lightHours.length >= 8) {
                    pot.lightHours.shift();
                }
                pot.lightHours.push(light);

                return await pot.save();
            }
        }
    }

    resolvers.Mutation.updatePot = async (root, {id, name, imgUrl, plant, plantDate}, req) => {
        const pot = await potModel.findOne({_id: id}).exec();

        // If user is authed and owner of the pot
        if (req.authUser && (req.authUser.admin || pot.owner._id.equals(req.authUser._id))) {
            const options = {
                min_length: 1,
                max_length: 100
            };

            if (fieldValidator.stringValidator([name], options)) {
                pot.name = name;
            }

            if (fieldValidator.stringValidator([imgUrl], options)) {
                pot.imgUrl = imgUrl;
            }

            if (fieldValidator.stringValidator([plant], options)) {
                pot.plant = plant;
            }

            if (fieldValidator.stringValidator([plantDate], options)) {
                pot.plantDate = plantDate;
            }

            return await pot.save();
        }
    }

    resolvers.Mutation.deletePot = async (root, {id}, req) => {
        const pot = await potModel.findOne({_id: id}).exec();

        // If user is authed and is owner of the pot
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(pot.owner._id))) {
            await pot.remove();
            return true;
        } else {
            throw errors.unauthorized();
        }
    }

    return resolvers
}
