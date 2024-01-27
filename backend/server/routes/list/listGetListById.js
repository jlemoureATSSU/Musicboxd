const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');

router.get('/getListById/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const list = await ListModel.findById(listId);

    if (!list) {
      return res.status(404).send('List not found');
    }

    res.json(list);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
