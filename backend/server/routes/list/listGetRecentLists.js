const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');

router.get('/getRecentLists', async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  let offset = parseInt(req.query.offset, 10);

  limit = isNaN(limit) || limit < 1 ? 5 : limit;

  offset = isNaN(offset) ? 0 : offset;

  try {
    const lists = await ListModel.find()
      .sort({ dateCreated: -1 })
      .skip(offset)
      .limit(limit);
    res.json(lists);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
