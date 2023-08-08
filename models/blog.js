const mongoose = require("mongoose");
const { Schema } = mongoose;

const heroBlogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    snippet:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
}, {timestamps: true});

const HeroBlog = mongoose.model("heroBlog", heroBlogSchema);

module.exports = HeroBlog;