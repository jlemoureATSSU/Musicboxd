const express = require('express');
const router = express.Router();
const List = require('../../models/listModel');

router.post('/save', async (req, res) => {
    const { _id, userName, listName, listDescription, albums } = req.body;

    try {
        let list;
        if (_id) {
            list = await List.findById(_id);
            if (!list) {
                return res.status(404).json({ message: 'List not found' });
            }
            list.listName = listName;
            list.listDescription = listDescription;
            list.albums = albums;
        } else {
            list = new List({
                userName,
                listName,
                listDescription,
                albums,
            });
        }

        const savedList = await list.save();

        res.status(201).json(savedList);
    } catch (error) {
        console.error('Error saving list:', error);
        res.status(500).json({ message: 'Error saving list', error: error.message });
    }
});

module.exports = router;
