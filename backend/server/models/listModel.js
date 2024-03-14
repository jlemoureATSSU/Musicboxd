const mongoose = require("mongoose");
const newListSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      label: "userName",
    },
    listName: {
      type: String,
      required: true,
      label: "listTitle",
    },
    listDescription: {
      type: String,
      required: false,
      label: "listDescription",
    },
    albums: [{
      id: {
        type: String,
        required: true,
        label: "id",
      },
    }],
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "lists" }
);

module.exports = mongoose.model('lists', newListSchema)