const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel')

router.post('/save', async (req, res) => {
    const { userName, ratingNum, albumId } = req.body;

    try {

        let rating = await Rating.findOne({ userName, albumId });

        if (rating) {
            rating.ratingNum = ratingNum;
            rating.dateUpdated = new Date();
        } else {
            rating = new Rating({ userName, ratingNum, albumId });
        }

        const savedRating = await rating.save();
        res.status(201).json(savedRating);
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ message: 'Error saving rating', error: error.message });
    }
});


module.exports = router;
