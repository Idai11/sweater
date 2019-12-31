const errors = require("./errors");
const potModel = require("../models/Pot.model");
const fieldValidator = require("../misc/fieldValidator")

module.exports = resolvers => {
    resolvers.Query.pot = async (root, {id}, req) => {
        const pot = await potModel.findOne({_id: objId(id)}).exec();
        if (req.authUser && (req.authUser.admin || req.authUser._id.equals(pot.owner._id))) {
            return user;
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

    return resolvers
}
