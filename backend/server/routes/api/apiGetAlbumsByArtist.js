const express = require('express');
const router = express.Router();
const axios = require('axios');
const myCache = require('../../utilities/cache'); 
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getAlbumsByArtist/:artistSpotifyId', async (req, res) => {
  const { artistSpotifyId } = req.params;
  const albumsCacheKey = `artist-albums-ids-${artistSpotifyId}`;
  const artistCacheKey = `artist-name-${artistSpotifyId}`;

  let cachedAlbumIds = myCache.get(albumsCacheKey);
  let cachedArtist = myCache.get(artistCacheKey);

  if (cachedArtist && cachedAlbumIds) {
    console.log(`Artist ${cachedArtist.name} and their album IDs fetched from cache`);
    return res.json({
      artist: cachedArtist,
      albumIds: cachedAlbumIds // Only sending IDs
    });
  }

  try {
    const accessToken = await getSpotifyAccessToken();

    // Fetch and cache artist name if not already cached
    if (!cachedArtist) {
      const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistSpotifyId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      cachedArtist = { name: artistResponse.data.name };
      myCache.set(artistCacheKey, cachedArtist);
    }

    // Fetch and cache album IDs if not already cached
    if (!cachedAlbumIds) {
      const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistSpotifyId}/albums`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: { include_groups: 'album', limit: 50 }
      });

      cachedAlbumIds = albumsResponse.data.items.map(album => album.id);
      myCache.set(albumsCacheKey, cachedAlbumIds);
    }

    res.json({
      artist: cachedArtist,
      albumIds: cachedAlbumIds // Only sending IDs
    });
  } catch (error) {
    console.error("Error fetching data from Spotify:", error);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
