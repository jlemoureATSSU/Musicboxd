const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { newUserValidation } = require('../../models/userValidator')
const newUserModel = require('../../models/userModel')

router.post('/signup', async (req, res) => {
    const validationResult = newUserValidation(req.body);
    if (!validationResult.success) {
        return res.status(400).send({ message: validationResult.error.issues[0].message });
    }

    const { username, email, password, firstName, lastName, phoneNumber } = req.body;

    try {
        const usernameExists = await newUserModel.findOne({ username });
        if (usernameExists) {
            return res.status(409).send({ message: "Username is taken, pick another" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new newUserModel({
            username,
            email,
            password: hashPassword,
            firstName,
            lastName,
            phoneNumber,
        });

        const savedUser = await newUser.save();
        res.status(201).send({ user: savedUser });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error trying to create new user" });
    }
});

module.exports = router;
