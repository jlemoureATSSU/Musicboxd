const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');

router.get('/getAllListsByUser/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    let { limit, offset } = req.query;

    limit = parseInt(limit, 10) || 7;
    offset = parseInt(offset, 10) || 0;

    const lists = await ListModel.find({ userName: userName })
      .sort({ dateCreated: -1 })
      .skip(offset)
      .limit(limit);

    res.json(lists);
  } catch (error) {
    console.error('Error fetching lists by user:', error);
    res.status(500).json({ message: 'Error fetching lists by user', error: error.message });
  }
});

router.get('/getAllListsByUser2/:userName', async (req, res) => {
  try {
    const { userName } = req.params;

    const lists = await ListModel.find({ userName: userName })
      .sort({ dateCreated: -1 });

    res.json(lists);
  } catch (error) {
    console.error('Error fetching lists by user:', error);
    res.status(500).json({ message: 'Error fetching lists by user', error: error.message });
  }
});




module.exports = router;
