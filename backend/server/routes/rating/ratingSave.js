const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');
const AvgRating = require('../../models/avgRatingModel');

router.post('/save', async (req, res) => {
    const { userName, ratingNum, albumId, artistId } = req.body;

    try {
        let rating = await Rating.findOne({ userName, albumId });
        let oldRatingNum = 0;
        let isNewRating = true;

        if (rating) {
            oldRatingNum = rating.ratingNum;
            rating.ratingNum = ratingNum;
            rating.dateUpdated = new Date();
            rating.artistId = artistId;
            isNewRating = false;
        } else {
            rating = new Rating({ userName, ratingNum, albumId, artistId });
        }

        const savedRating = await rating.save();

        let avgRating = await AvgRating.findOne({ albumId });

        if (avgRating) {
            if (!isNewRating) {
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
