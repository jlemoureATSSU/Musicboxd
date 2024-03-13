const express = require('express');
const router = express.Router();
const Comment = require('../../models/commentModel');
router.post('/submit', async (req, res) => {
    try {
      const { userName, albumId, content } = req.body;
  
      if (!userName || !albumId || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newComment = new Comment({
        userName,
        albumId,
        content,
      });
  
      await newComment.save();
  
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;
