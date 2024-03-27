const mongoose = require("mongoose");
const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: false,
      label: "email",
    },
    password: {
      required: true,
      type: String,
      min: 3
    },
    firstName: {
      type: String,
      required: true,
      label: "firstName",

    },
    lastName: {
      type: String,
      required: true,
      label: "lastName",
    },
    phoneNumber: {
      type: String,
      required: false,
      label: "phoneNumber",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema)