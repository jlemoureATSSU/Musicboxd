const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');
const AvgRating = require('../../models/avgRatingModel'); // Assuming you've created this model

router.post('/save', async (req, res) => {
    const { userName, ratingNum, albumId } = req.body;

    try {
        let rating = await Rating.findOne({ userName, albumId });
        let oldRatingNum = 0;

        if (rating) {
            // If updating an existing rating, store the old rating value to adjust the average correctly
            oldRatingNum = rating.ratingNum;
            rating.ratingNum = ratingNum;
            rating.dateUpdated = new Date();
        } else {
            rating = new Rating({ userName, ratingNum, albumId });
        }

        const savedRating = await rating.save();

        // Check if AvgRating exists for the album
        let avgRating = await AvgRating.findOne({ albumId });

        if (avgRating) {
            // If updating, adjust totalRatings and numberOfRatings accordingly
            if (oldRatingNum > 0) { // It's an update
                avgRating.totalRatings = avgRating.totalRatings - oldRatingNum + ratingNum;
            } else { // It's a new rating
                avgRating.totalRatings += ratingNum;
                avgRating.numberOfRatings += 1;
            }
        } else {
            // If it's a new AvgRating entry
            avgRating = new AvgRating({
                albumId,
                totalRatings: ratingNum,
                numberOfRatings: 1,
                averageRating: ratingNum, // Initial average is just the rating itself
            });
        }

        // Recalculate the average rating
        avgRating.averageRating = avgRating.totalRatings / avgRating.numberOfRatings;
        
        await avgRating.save();

        res.status(201).json(savedRating);
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ message: 'Error saving rating', error: error.message });
    }
});

module.exports = router;
