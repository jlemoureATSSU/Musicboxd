const express = require('express');
const router = express.Router();
const axios = require('axios');
const myCache = require('../../utilities/cache'); // Adjust the path as necessary
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getAlbumDetails/:spotifyAlbumId', async (req, res) => {
  const { spotifyAlbumId } = req.params;
  const cacheKey = `album-${spotifyAlbumId}`; // Standardized cache key
  let albumDetails = myCache.get(cacheKey);

  if (albumDetails) {
    console.log(`album details from cache for ID: ${spotifyAlbumId}`);
    return res.json(albumDetails);
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${spotifyAlbumId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Use the access token for Spotify API
      },
    });

    const album = response.data;
    const albumDetails = {
      name: album.name,
      artists: album.artists.map(artist => artist.name).join(', '),
      release_date: album.release_date,
      coverArtUrl: album.images.length > 0 ? album.images[0].url : undefined,
    };

    myCache.set(cacheKey, albumDetails);
    console.log(`album details from Spotify API for ID: ${spotifyAlbumId}`);


    res.json(albumDetails);
  } catch (error) {
    console.error("Error fetching album details from Spotify:", error);
    // Consider handling different types of errors differently
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
