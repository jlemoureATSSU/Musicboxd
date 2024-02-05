const express = require('express');
const router = express.Router();
const AvgRating = require('../../models/avgRatingModel');

// Route to get the top 10 highest-rated albums
router.get('/getHighestRatedAlbums', async (req, res) => {
    try {
        const highestRatedAlbums = await AvgRating.find({})
            .sort({ averageRating: -1 }) // Sort by averageRating in descending order
            .limit(10) // Limit to top 10
            .exec(); // Execute the query

        if (!highestRatedAlbums.length) {
            return res.status(404).json({ message: 'No rated albums found' });
        }

        // Optionally, enrich the album data with additional details from other sources/models here

        res.status(200).json(highestRatedAlbums);
    } catch (error) {
        console.error('Error fetching highest rated albums:', error);
        res.status(500).json({ message: 'Error fetching highest rated albums', error: error.message });
    }
});

module.exports = router;
