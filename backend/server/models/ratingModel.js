const mongoose = require("mongoose");
const newRatingSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      label: "userName",
    },
    ratingNum: {
      type: Number,
      required: true,
      label: "ratingNum",
    },
    albumId: {
      type: String,
      required: true,
      label: "albumId",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "ratings" }
);

module.exports = mongoose.model('ratings', newRatingSchema)