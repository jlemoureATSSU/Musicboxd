const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');

router.get('/getMostLiked', async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  let offset = parseInt(req.query.offset, 10);

  limit = isNaN(limit) || limit < 1 ? 7 : limit;
  offset = isNaN(offset) ? 0 : offset;

  try {
    const lists = await ListModel.find({})
      .sort({ likeCount: -1, dateCreated: -1 })
      .skip(offset)
      .limit(limit);

    res.json(lists);
  } catch (error) {
    console.error('Error fetching most liked lists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
