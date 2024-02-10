const express = require('express');
const router = express.Router();
const AvgRating = require('../../models/avgRatingModel');

router.get('/getHighestRatedAlbums', async (req, res) => {
    try {
        const highestRatedAlbums = await AvgRating.find({})
            .sort({ averageRating: -1 }) 
            .limit(8) 
            .exec(); 

        if (!highestRatedAlbums.length) {
            return res.status(404).json({ message: 'No rated albums found' });
        }


        res.status(200).json(highestRatedAlbums);
    } catch (error) {
        console.error('Error fetching highest rated albums:', error);
        res.status(500).json({ message: 'Error fetching highest rated albums', error: error.message });
    }
});

module.exports = router;
