const express = require('express');
const router = express.Router();
const List = require('../../models/listModel');

router.post('/like', async (req, res) => {
    const { username, listId } = req.body;

    if (!username || !listId) {
        return res.status(400).json({ message: 'Missing username or list ID' });
    }

    try {
        const updatedList = await List.findOneAndUpdate(
            { _id: listId, likes: { $ne: username } },
            { $push: { likes: username } },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).json({ message: 'List not found or user already liked the list' });
        }

        res.status(200).json({ message: 'List liked successfully!', updatedList });
    } catch (error) {
        console.error('Failed to like the list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
