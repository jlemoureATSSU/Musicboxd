const express = require('express');
const router = express.Router();
const ListComment = require('../../models/listCommentsModel');

router.post('/submitToList', async (req, res) => {
    try {
        const { userName, listId, content } = req.body;

        if (!userName || !listId || !content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newListComment = new ListComment({
            userName,
            listId,
            content,
        });

        await newListComment.save();

        res.status(201).json(newListComment);
    } catch (error) {
        console.error('Failed to submit list comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
