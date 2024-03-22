const express = require('express');
const axios = require('axios');
const router = express.Router();
const Rating = require('../../models/ratingModel');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getRecommendedAlbums/:userName', async (req, res) => {
    try {
        const { userName } = req.params;
        const topRatedAlbums = await Rating.find({ userName })
                                           .sort({ ratingNum: -1 })
                                           .limit(5);

        if (topRatedAlbums.length === 0) {
            return res.status(404).json({ message: 'No ratings found for user' });
        }

        const seedArtists = topRatedAlbums.map(rating => rating.artistId).join(',');

        const accessToken = await getSpotifyAccessToken();

        const recommendationsResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: {
                seed_artists: seedArtists,
                limit: 10,
                market: 'US'
            }
        });

        const recommendedAlbums = recommendationsResponse.data.tracks.map(track => ({
            albumId: track.album.id,
        }));

        res.json(recommendedAlbums);
    } catch (error) {
        console.error('Error in /getRecommendedAlbumsForUser:', error);
        res.status(500).json({ message: 'Error getting recommended albums for user', error: error.message });
    }
});


module.exports = router;
