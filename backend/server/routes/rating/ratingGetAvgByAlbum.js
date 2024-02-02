const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');

router.get('/getAvgByAlbum/:albumId', async (req, res) => {
    const { albumId } = req.params;

    try {
        const averageRating = await Rating.aggregate([
            { $match: { albumId: albumId } }, 
            {
                $group: {
                    _id: '$albumId',
                    averageRating: { $avg: '$ratingNum' }
                }
            }
        ]);

        if (averageRating.length > 0) {
            res.status(200).json({ albumId: albumId, averageRating: averageRating[0].averageRating });
        } else {
            res.status(404).json({ message: 'No ratings found for this album' });
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ message: 'Error fetching average rating', error: error.message });
    }
});

module.exports = router;
