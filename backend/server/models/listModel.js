const mongoose = require("mongoose");

const newListSchema = new mongoose.Schema({
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
    label: "listDescription",
  },
  albums: [
    {
      id: {
        type: String,
        required: true,
        label: "id",
      },
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: String,
      unique: true,
    }
  ],
  likeCount: {
    type: Number,
    default: 0,
  }
},
{ collection: "lists" }
);

module.exports = mongoose.model('lists', newListSchema);
