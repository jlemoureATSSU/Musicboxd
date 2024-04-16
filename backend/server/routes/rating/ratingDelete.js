const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');
const AvgRating = require('../../models/avgRatingModel');

router.delete('/delete', async (req, res) => {
    const { userName, albumId } = req.body;

    try {
        // Find and delete the rating
        const rating = await Rating.findOneAndDelete({ userName, albumId });
        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        // Retrieve the AvgRating entry
        const avgRating = await AvgRating.findOne({ albumId });
        if (avgRating) {
            if (avgRating.numberOfRatings === 1) {
                // If it was the only rating, delete the AvgRating document
                await AvgRating.deleteOne({ albumId });
                res.status(200).json({ message: 'Rating deleted successfully', avgDeleted: true });
            } else {
                // Otherwise, update the AvgRating document
                avgRating.totalRatings -= rating.ratingNum;
                avgRating.numberOfRatings -= 1;
                avgRating.averageRating = avgRating.totalRatings / avgRating.numberOfRatings;
                await avgRating.save();
                res.status(200).json({ message: 'Rating deleted successfully', avgDeleted: false });
            }
        } else {
            // If no AvgRating found, this means no average needs updating
            res.status(200).json({ message: 'Rating deleted successfully', avgDeleted: false });
        }
    } catch (error) {
        console.error('Error deleting rating:', error);
        res.status(500).json({ message: 'Error deleting rating', error: error.message });
    }
});

module.exports = router;
