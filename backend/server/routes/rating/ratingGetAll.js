const express = require('express');
const router = express.Router();
const Rating = require('../../models/ratingModel');

router.get('/getAll', async (req, res) => {
    try {
        const allRatings = await Rating.find({})
            .sort({ dateCreated: -1 }) 
            .select('userName ratingNum albumId dateCreated'); 

        res.json(allRatings);
    } catch (error) {
        console.error('Error getting all ratings:', error);
        res.status(500).json({ message: 'Error getting all ratings', error: error.message });
    }
});

module.exports = router;
