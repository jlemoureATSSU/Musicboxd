const express = require('express');
const router = express.Router();
const ListModel = require('../../models/listModel');
const RatingModel = require('../../models/ratingModel');
const UserModel = require('../../models/userModel');  

router.get('/getProfileDetails/:userName', async (req, res) => {
    try {
        const { userName } = req.params;

        // Get user details including the join date
        const user = await UserModel.findOne({ username: userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const joinDate = user.date;

        // Get count of lists
        const listCount = await ListModel.countDocuments({ userName: userName });

        // Get count of ratings
        const ratingCount = await RatingModel.countDocuments({ userName: userName });

        res.json({ userName, joinDate, listCount, ratingCount });
    } catch (error) {
        console.error('Error fetching profile details by user:', error);
        res.status(500).json({ message: 'Error fetching profile details', error: error.message });
    }
});

module.exports = router;
