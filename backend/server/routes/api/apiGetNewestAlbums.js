const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getNewestAlbums', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;

    try {
        const accessToken = await getSpotifyAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/browse/new-releases`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                limit: limit,
                offset: offset,
                country: 'US'
            }
        });

        const albums = response.data.albums.items.map(album => ({
            albumId: album.id,
        }));

        res.json(albums);
    } catch (error) {
        console.error('Error fetching newest albums from Spotify:', error);
        res.status(500).send('Error fetching newest album data');
    }
});

module.exports = router;
