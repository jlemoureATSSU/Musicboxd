const express = require('express');
const router = express.Router();
const List = require('../../models/listModel');

router.get('/albumInListsCount/:mbid', async (req, res) => {
    const { mbid } = req.params;

    try {
        const count = await List.countDocuments({ 'albums.id': mbid });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching album list count:', error);
        res.status(500).json({ message: 'Error fetching album list count', error: error.message });
    }
});

module.exports = router;
