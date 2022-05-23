const express = require("express")
const router = express.Router()
const {getUsers,createUser,getToken,signInUser} = require("./userController")
const multer = require("./multer")

router.get("/allusers", getUsers)
router.post("/register", multer, createUser)
router.get("/:id/:token", getToken)
router.post("/login", signInUser)

module.exports = router