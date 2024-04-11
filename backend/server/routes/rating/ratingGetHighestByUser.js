const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');

router.get('/topRatings/:userName', async (req, res) => {
    try {
        const { userName } = req.params;
        let { limit, offset } = req.query;

        limit = parseInt(limit, 10) || 10;
        offset = parseInt(offset, 10) || 0;

        const topRatings = await Rating.find({ userName })
            .sort({ ratingNum: -1 })
            .skip(offset)
            .limit(limit);

        res.json(topRatings);
    } catch (error) {
        console.error('Error getting top ratings:', error);
        res.status(500).json({ message: 'Error getting top ratings', error: error.message });
    }
});

module.exports = router;
