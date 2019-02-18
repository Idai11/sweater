const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const potSchema = new Schema({
    schedule: [{
        action: String,
        start: String,
        end: String,
    }],
    owner_id: Schema.Types.ObjectId,
    ip: String,
    history: [{
        moisture: Number,
        temp: Number,
        time: Date
    }]
});
