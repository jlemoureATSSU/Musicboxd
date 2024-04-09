const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');

router.get('/topRatings/:userName', async (req, res) => {
    try {
        const { userName } = req.params;
        const topRatings = await Rating.find({ userName })
            .sort({ ratingNum: -1 })
            .limit(7);

        // Instead of sending a 404, send an empty array with a 200 OK status
        res.json(topRatings);
    } catch (error) {
        console.error('Error getting top ratings:', error);
        res.status(500).json({ message: 'Error getting top ratings', error: error.message });
    }
});

module.exports = router;

