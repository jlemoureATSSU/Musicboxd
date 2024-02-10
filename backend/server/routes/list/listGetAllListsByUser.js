const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');

router.get('/getAllListsByUser/:userName', async (req, res) => {
    try {
      const { userName } = req.params; 
      const lists = await ListModel.find({ userName: userName }).sort({ dateCreated: -1 });
      res.json(lists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching lists by user', error: error.message });
    }
});

module.exports = router;
