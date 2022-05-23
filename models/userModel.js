const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    image: {
        type:String,
    },
    verified: {
        type: Boolean,
    },
    myToken:{
        type: String
    },
    verifiedToken: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "verifies"
    }
},{timestamps: true})

module.exports = mongoose.model("user", UserSchema)