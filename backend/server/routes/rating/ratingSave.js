const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');
const AvgRating = require('../../models/avgRatingModel'); 

router.post('/save', async (req, res) => {
    const { userName, ratingNum, albumId } = req.body;

    try {
        let rating = await Rating.findOne({ userName, albumId });
        let oldRatingNum = 0;

        if (rating) {
            oldRatingNum = rating.ratingNum;
            rating.ratingNum = ratingNum;
            rating.dateUpdated = new Date();
        } else {
            rating = new Rating({ userName, ratingNum, albumId });
        }

        const savedRating = await rating.save();

        let avgRating = await AvgRating.findOne({ albumId });

        if (avgRating) {
            if (oldRatingNum > 0) { 
                avgRating.totalRatings = avgRating.totalRatings - oldRatingNum + ratingNum;
            } else { 
                avgRating.totalRatings += ratingNum;
                avgRating.numberOfRatings += 1;
            }
        } else {
            avgRating = new AvgRating({
                albumId,
                totalRatings: ratingNum,
                numberOfRatings: 1,
                averageRating: ratingNum, 
            });
        }

        avgRating.averageRating = avgRating.totalRatings / avgRating.numberOfRatings;
        
        await avgRating.save();

        res.status(201).json(savedRating);
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ message: 'Error saving rating', error: error.message });
    }
});

module.exports = router;
