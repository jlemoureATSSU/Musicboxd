const express = require('express');
const router = express.Router();
const AvgRating = require('../../models/avgRatingModel');

router.get('/getAvgByAlbum/:albumId', async (req, res) => {
    const { albumId } = req.params;

    try {
        const avgRatingDoc = await AvgRating.findOne({ albumId: albumId });

        if (avgRatingDoc) {
            res.status(200).json({
                albumId: albumId,
                averageRating: avgRatingDoc.averageRating,
                numberOfRatings: avgRatingDoc.numberOfRatings
            });
        } else {
            res.status(404).json({ message: 'No ratings found for this album' });
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ message: 'Error fetching average rating', error: error.message });
    }
});

module.exports = router;
