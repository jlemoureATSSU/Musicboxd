const mongoose = require("mongoose");

const avgRatingSchema = new mongoose.Schema({
  albumId: {
    type: String,
    required: true,
    unique: true,
  },
  totalRatings: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfRatings: {
    type: Number,
    required: true,
    default: 0,
  },
  averageRating: {
    type: Number,
    required: true,
    default: 0,
  },
}, { collection: "avgRatings" });

module.exports = mongoose.model('AvgRating', avgRatingSchema);
