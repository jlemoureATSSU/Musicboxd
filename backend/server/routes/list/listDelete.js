const express = require('express');
const router = express.Router();
const List = require('../../models/listModel');

router.delete('/delete/:id', async (req, res) => {
    const listId = req.params.id;

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        await List.deleteOne({ _id: listId });

        res.status(200).json({ message: 'List successfully deleted' });
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ message: 'Error deleting list', error: error.message });
    }
});

module.exports = router;
