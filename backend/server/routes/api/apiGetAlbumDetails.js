const express = require('express');
const router = express.Router();
const axios = require('axios');
const myCache = require('../../utilities/cache');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getAlbumDetails/:spotifyId', async (req, res) => {
  const { spotifyId } = req.params;
  const cacheKey = `album-${spotifyId}`;
  let albumDetails = myCache.get(cacheKey);

  if (albumDetails) {
    console.log(`album details from cache for: ${albumDetails.name}`);
    return res.json(albumDetails);
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${spotifyId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const album = response.data;
    const albumDetails = {
      id: spotifyId,
      name: album.name,
      artists: album.artists.map(artist => artist.name).join(', '),
      release_date: album.release_date,
      coverArtUrl: album.images.length > 0 ? album.images[0].url : undefined,
    };

    myCache.set(cacheKey, albumDetails);
    console.log(`album details from Spotify API for: ${albumDetails.name}`);


    res.json(albumDetails);
  } catch (error) {
    console.error("Error fetching album details from Spotify:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
