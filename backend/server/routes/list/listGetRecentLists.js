const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');

router.get('/getRecentLists', async (req, res) => {
  try {
    const lists = await ListModel.find().sort({ dateCreated: -1 }).limit(5);
    res.json(lists);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
