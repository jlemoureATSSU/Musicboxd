const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');
const AvgRating = require('../../models/avgRatingModel'); 

router.post('/save', async (req, res) => {
    const { userName, ratingNum, albumId } = req.body;

    try {
        let rating = await Rating.findOne({ userName, albumId });
        let oldRatingNum = 0;
        let isNewRating = true; // Added flag to identify if the rating is new

        if (rating) {
            oldRatingNum = rating.ratingNum;
            rating.ratingNum = ratingNum;
            rating.dateUpdated = new Date();
            isNewRating = false; // Set flag to false as the rating exists
        } else {
            rating = new Rating({ userName, ratingNum, albumId });
        }

        const savedRating = await rating.save();

        let avgRating = await AvgRating.findOne({ albumId });

        if (avgRating) {
            if (!isNewRating) {
                // Adjust totalRatings by subtracting old rating and adding new rating
                avgRating.totalRatings = avgRating.totalRatings - oldRatingNum + ratingNum;
            } else {
                // Handle as a new rating
                avgRating.totalRatings += ratingNum;
                avgRating.numberOfRatings += 1;
            }
        } else {
            // No existing avgRating, create a new one
            avgRating = new AvgRating({
                albumId,
                totalRatings: ratingNum,
                numberOfRatings: 1,
            });
        }

        // Recalculate average rating
        avgRating.averageRating = avgRating.totalRatings / avgRating.numberOfRatings;
        
        await avgRating.save();

        res.status(201).json(savedRating);
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ message: 'Error saving rating', error: error.message });
    }
});

module.exports = router; // Corrected "module. Exports" to "module.exports"
