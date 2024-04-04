const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/searchAlbums', async (req, res) => {
    const searchQuery = req.query.search;

    try {
        const accessToken = await getSpotifyAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                q: searchQuery,
                type: 'album',
                limit: 5
            }
        });

        const albums = response.data.albums.items.map(album => {
            const artistNames = album.artists.map(artist => artist.name).join(', ');
            const artistIds = album.artists.map(artist => artist.id);
            const albumDetail = {
                id: album.id,
                name: album.name,
                artists: artistNames,
                artistIds: artistIds,
                release_date: album.release_date,
                coverArtUrl: album.images.length > 0 ? album.images[0].url : undefined,
            };

            return albumDetail;
        });

        console.log(`results from Spotify API for query: "${searchQuery}"`);
        res.json({ albums });
    } catch (error) {
        console.error('Error fetching albums from Spotify: ', error);
        res.status(500).send('Error fetching album data');
    }
});

module.exports = router;
