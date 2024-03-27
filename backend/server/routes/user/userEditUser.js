const express = require("express");
const z = require('zod')
const bcrypt = require("bcrypt");
const newUserModel = require('../../models/userModel')
const { newUserValidation } = require('../../models/userValidator');
const { generateAccessToken } = require('../../utilities/generateToken');

const router = express.Router();

router.post('/editUser', async (req, res) => {
    const { error } = newUserValidation(req.body);
    if (error) return res.status(400).send({ message: error.errors[0].message });

    const {userId, username, email, password} = req.body

    const user = await newUserModel.findOne({ username: username })
    if (user) userIdReg = JSON.stringify(user._id).replace(/["]+/g, '')
    if (user && userIdReg !== userId) return res.status(409).send({ message: "Username is taken, pick another" })

    const generateHash = await bcrypt.genSalt(Number(10))

    const hashPassword = await bcrypt.hash(password, generateHash)

    newUserModel.findByIdAndUpdate(userId, {
        username : username, 
        email : email, 
        password : hashPassword
    } ,function (err, user) {
        if (err){
            console.log(err);
        } else {
            const accessToken = generateAccessToken(user._id, email, username, hashPassword)  
            res.header('Authorization', accessToken).send({ accessToken: accessToken })
        }
    });
})

module.exports = router;
