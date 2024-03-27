const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/searchArtists', async (req, res) => {
  const searchQuery = req.query.search;

  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        q: searchQuery,
        type: 'artist',
        limit: 3
      }
    });

    const artists = response.data.artists.items.map(artist => ({
      id: artist.id,
      name: artist.name,
    }));

    console.log(`results from Spotify API for query: "${searchQuery}"`);
    res.json({ artists });
  } catch (error) {
    console.error('Error fetching artists from Spotify: ', error);
    res.status(500).send('Error fetching artist data');
  }
});

module.exports = router;
