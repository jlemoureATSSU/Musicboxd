const express = require("express");
const z = require('zod')
const { userLoginValidation } = require('../../models/userValidator')
const newUserModel = require('../../models/userModel')
const bcrypt = require('bcrypt')
const { generateAccessToken } = require('../../utilities/generateToken')

const router = express.Router();


router.post('/login', async (req, res) => {

  const { error } = userLoginValidation(req.body);
  if (error) return res.status(400).send({ message: error.errors[0].message });

  const { username, password } = req.body

  const user = await newUserModel.findOne({ username: username });

  if (!user)
    return res
      .status(401)
      .send({ message: "Username does not exist, try again" });

  const checkPasswordValidity = await bcrypt.compare(
    password,
    user.password
  );

  if (!checkPasswordValidity)
    return res
      .status(401)
      .send({ message: "Password is incorrect, try again" });

  const accessToken = generateAccessToken(user._id, user.email, user.username, user.password)

  res.header('Authorization', accessToken).send({ accessToken: accessToken })
})

module.exports = router;
