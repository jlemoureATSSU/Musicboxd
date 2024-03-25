const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getTracklist/:albumId', async (req, res) => {
    const { albumId } = req.params;

    try {
        const accessToken = await getSpotifyAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { limit: 50 }
        });

        const tracks = response.data.items.map(track => ({
            id: track.id,
            name: track.name,
            track_number: track.track_number,
            duration_ms: track.duration_ms,
            preview_url: track.preview_url
        }));

        console.log(`Tracklist fetched for album: ${albumId}`);
        res.json({ tracks });
    } catch (error) {
        console.error('Error fetching album tracks:', error);
        res.status(500).send('Error fetching album tracks');
    }
});

module.exports = router;