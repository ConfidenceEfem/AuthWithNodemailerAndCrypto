const userModel = require("./models/userModel")
const verifyModel  = require("./models/VerifiedModel")
const bcrypt = require("bcrypt")
const upload = require("./multer")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
require("dotenv").config()

const transport = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: "earli.finance.ng@gmail.com",
        pass: "earli@2022",
    }
})

const getUsers = async (req,res)=>{
    try{
            const allUsers = await userModel.find()
            res.status(201).json({message: "All Users", data: allUsers})
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const createUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

     const user =  await userModel.create({email,name,password: hash, image: req.file.path})

        const createToken = crypto.randomBytes(32).toString("hex")
        const testToken = crypto.randomBytes(4).toString("hex")
        const getToken = jwt.sign({createToken}, process.env.SECRET, {expiresIn: process.env.EXPIRES})

        await verifyModel.create({
            token: getToken,
            userId: user._id
        })

       const mailoptions = {
            from: "earli.finance.ng@gmail.com",
            to: email,
            subject: "Registration Verification",
            html: `<h3>This is to verify your account, please use the <a href="http://localhost:2000/${user._id}/${getToken}">Link</a> to finish up your registration.... This is a test code ${testToken}</h3>`
        }

        transport.sendMail(mailoptions, (err,info)=>{
            if(err){
                console.log(err.message)
            }else{
                console.log("Mail Sent", info.response)
            }
        })

        res.status(200).json({message: "Please check your mail for completion"})

    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const getToken = async (req,res)=>{
    try{
        const user = await userModel.findById(req.params.id)
        if(user){
            await userModel.findByIdAndUpdate(req.params.id, {
                verified: true,
                myToken: req.params.token
            }, {new: true})
            await verifyModel.findByIdAndUpdate(user._id, {token: "", userId: user._id},{new: true})
            res.status(201).json({message: "You have been signed In"})
        }else{
            res.status(404).json({message: "User not authorized"})
        }
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const signInUser = async (req,res)=>{
    try{
        const {email, password} = req.body
        const Users = await userModel.findOne({email})
        if(Users){
            const checkPassword = await bcrypt.compare(password, Users.password)
            if(checkPassword){
                if(Users.verified){
                   const token = jwt.sign(
                       {
                            _id: Users._id
                       }
                       , process.env.SECRET, {expiresIn: "1d"}
                       )
                       const {password, ...doc} = Users._doc
                       res.status(201).json({message: "Welcome On board", data: {...doc, token}})
                }else{
                    const createToken = crypto.randomBytes(32).toString("hex")
                    const testToken = crypto.randomBytes(4).toString("hex")
                    const getToken = jwt.sign({createToken}, process.env.SECRET, {expiresIn: process.env.EXPIRES})        
       const mailoptions = {
        from: "ajmarketplace52@gmail.com",
        to: email,
        subject: "Registration Verification",
        html: `<h3>This is to verify your account, please use the <a href="http://localhost:2000/${Users._id}/${getToken}">Link</a> to finish up your registration.... This is a test code ${testToken}</h3>`
    }

                    transport.sendMail(mailoptions, (err,info)=>{
                        if(err){
                            console.log(err.message)
                        }else{
                            console.log("Mail Sent", info.response)
                        }
                    })
                }
            }else{
                res.status(400).json({message: "password is incorrect"})
            }
        }else{
            res.status(400).json({message: "User does not exist"})
        }

    }catch(error){
        res.status(404).json({message: error.message})
    }
}
module.exports = {
    getUsers, createUser,getToken,signInUser
}
