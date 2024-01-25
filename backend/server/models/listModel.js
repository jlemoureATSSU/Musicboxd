const mongoose = require("mongoose");
//list schema/model
const newListSchema = new mongoose.Schema(
  {
    listName: {
      type: String,
      required: true,
      label: "listTitle",
    },
    listDescription: {
      type: String,
      required: true,
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