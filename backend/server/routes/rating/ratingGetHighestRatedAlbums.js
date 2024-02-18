const express = require('express');
const router = express.Router();
const AvgRating = require('../../models/avgRatingModel');

router.get('/getHighestRatedAlbums', async (req, res) => {
    let limit = parseInt(req.query.limit, 10);
    limit = isNaN(limit) || limit < 1 ? 8 : limit;

    try {
        const query = AvgRating.find({}).sort({ averageRating: -1 });
 
        if (limit !== 0) {
            query.limit(limit);
        }
        const highestRatedAlbums = await query.exec();

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
