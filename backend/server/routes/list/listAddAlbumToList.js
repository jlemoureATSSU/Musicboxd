const express = require('express');
const router = express.Router();
const List = require('../../models/listModel');

router.post('/addAlbumToList/:listId', async (req, res) => {
  const { listId } = req.params;
  const { albumId } = req.body;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.albums.some(album => album.id === albumId)) {
      return res.status(400).json({ message: 'Album already exists in the list' });
    }

    list.albums.push({ id: albumId });
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error('Error adding album to list:', error);
    res.status(500).json({ message: 'Error adding album to list', error: error.message });
  }
});

module.exports = router;
