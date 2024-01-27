const express = require('express');
const router = express.Router();
const List = require('../../models/listModel')

router.post('/create', async (req, res) => {

    const { userName, listName, listDescription, albums } = req.body;

    const newList = new List({
        userName,
        listName,
        listDescription,
        albums, 
    });

    try {
        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating the list', error: error.message });
    }
});

module.exports = router;
