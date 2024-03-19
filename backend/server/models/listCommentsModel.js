const mongoose = require("mongoose");
const newListCommentSchema = new mongoose.Schema(
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
    listId: {
      type: String,
      required: true,
      label: "listId",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "listComments" }
);

module.exports = mongoose.model('listComments', newListCommentSchema)