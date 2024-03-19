const mongoose = require("mongoose");
const newAlbumCommentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      label: "userName",
    },
    content: {
      type: String,
      required: true,
      label: "content",
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
  { collection: "albumComments" }
);

module.exports = mongoose.model('albumComments', newAlbumCommentSchema)