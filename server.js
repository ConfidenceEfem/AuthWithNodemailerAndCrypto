const express  = require("express")
require("./utils")
const mongoose  = require("mongoose")
const router = require("./Router")
require("dotenv").config()
const port = process.env.PORT
const app = express()


app.use(express.json())

app.use("/", router)

app.listen(port, ()=>{
    console.log("Listening on port " + port)
})

