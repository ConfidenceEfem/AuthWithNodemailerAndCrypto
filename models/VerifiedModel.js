const mongoose = require("mongoose")

const VerifiedSchema = new mongoose.Schema({
    token: {
        type:String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},{timestamps: true})

module.exports = mongoose.model("verifies", VerifiedSchema)