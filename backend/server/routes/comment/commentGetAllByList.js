const express = require('express');
const router = express.Router();
const ListComment = require('../../models/listCommentsModel'); 

router.get('/getAllByList/:listId', async (req, res) => {
    try {
        const { listId } = req.params;

        if (!listId) {
            return res.status(400).json({ message: 'List ID is required' });
        }

        const comments = await ListComment.find({ listId: listId }).sort({ dateCreated: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
