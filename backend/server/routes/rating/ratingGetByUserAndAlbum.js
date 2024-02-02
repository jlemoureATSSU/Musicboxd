const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel')

router.get('/getByUserAndAlbum/:userName/:albumId', async (req, res) => {
    try {
        const { userName, albumId } = req.params;
        const rating = await Rating.findOne({ userName, albumId });
        
        if (rating) {
            res.json(rating);
        } else {
            res.status(404).json({ message: 'Rating not found' });
        }
    } catch (error) {
        console.error('Error getting rating:', error);
        res.status(500).json({ message: 'Error getting rating', error: error.message });
    }
});

module.exports = router;