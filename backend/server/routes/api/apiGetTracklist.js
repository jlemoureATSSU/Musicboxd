const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getTracklist/:albumId', async (req, res) => {
    const { albumId } = req.params;

    try {
        const accessToken = await getSpotifyAccessToken();

        // Fetch album details to get the popularity score
        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        // Fetch tracks of the album
        const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { limit: 50 }
        });

        const tracks = tracksResponse.data.items.map(track => ({
            id: track.id,
            name: track.name,
            track_number: track.track_number,
            duration_ms: track.duration_ms,
            preview_url: track.preview_url
        }));

        // Include popularity score in the response
        const albumPopularity = albumResponse.data.popularity;

        console.log(`Tracklist and popularity fetched for album: ${albumId}`);
        res.json({ tracks, popularity: albumPopularity });
    } catch (error) {
        console.error('Error fetching album details:', error);
        res.status(500).send('Error fetching album details');
    }
});

module.exports = router;
