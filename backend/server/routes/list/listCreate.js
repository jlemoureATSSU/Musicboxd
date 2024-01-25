const express = require('express');
const router = express.Router();
const List = require('../../models/listModel')

router.post('/create', async (req, res) => {
    // Destructure the required fields from the request body
    const { listName, listDescription, albums } = req.body;

    // Create a new list instance using the List model
    const newList = new List({
        listName,
        listDescription,
        albums, // Assuming 'albums' is an array of objects with an 'mbid' property
    });

    try {
        // Save the new list to the database
        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (error) {
        console.error(error); // Log the full error
        res.status(500).json({ message: 'Error creating the list', error: error.message });
    }
});

module.exports = router;
