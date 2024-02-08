const express = require('express');
const router = express.Router();
const axios = require('axios');
const myCache = require('../../utilities/cache'); 
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/searchArtists', async (req, res) => {
  const searchQuery = req.query.search;
  const cacheKey = `search-${searchQuery}`;
  let cachedIds = myCache.get(cacheKey);
  if (cachedIds) {
    console.log(`results from cache for : "${searchQuery}"`);
    const artists = cachedIds.map(id => myCache.get(`artist-${id}`)).filter(detail => detail !== undefined);
    return res.json({ artists });
  }
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

    const artistIds = artists.map(artist => artist.id);
    myCache.set(cacheKey, artistIds);
    console.log(`results from Spotify API for query: "${searchQuery}"`);


    res.json({ artists }); // Send the formatted artists back to the client
  } catch (error) {
    console.error('Error fetching artists from Spotify: ', error);
    res.status(500).send('Error fetching artist data');
  }
});

module.exports = router;
