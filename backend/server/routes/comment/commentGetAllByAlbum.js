const express = require('express');
const router = express.Router();
const Comment = require('../../models/albumCommentsModel');

router.get('/getAllByAlbum/:albumId', async (req, res) => {
    try {
        const { albumId } = req.params;

        if (!albumId) {
            return res.status(400).json({ message: 'Album ID is required' });
        }

        const comments = await Comment.find({ albumId: albumId }).sort({ dateCreated: -1 }); 

        res.json(comments);
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

  
  module.exports = router;
