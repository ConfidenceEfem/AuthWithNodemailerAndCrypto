const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGOOSE_URL).then(()=>{
    console.log("Connected to DB")
})

module.exports = mongoose