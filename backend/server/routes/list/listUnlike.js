const express = require('express');
const router = express.Router();
const List = require('../../models/listModel');

router.post('/unlike', async (req, res) => {
    const { username, listId } = req.body;

    if (!username || !listId) {
        return res.status(400).json({ message: 'Missing username or list ID' });
    }

    try {
        const updatedList = await List.findOneAndUpdate(
            { _id: listId, likes: username },
            { 
              $pull: { likes: username },
              $inc: { likeCount: -1 }
            },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).json({ message: 'List not found or user had not liked the list' });
        }

        res.status(200).json({ message: 'List unliked successfully!', updatedList });
    } catch (error) {
        console.error('Failed to unlike the list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
