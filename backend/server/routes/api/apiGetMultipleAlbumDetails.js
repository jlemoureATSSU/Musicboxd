const express = require('express');
const router = express.Router();
const axios = require('axios');
const myCache = require('../../utilities/cache');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.post('/getMultipleAlbumDetails', async (req, res) => {
  const { albumIds } = req.body; 
  const albumDetails = [];
  const uncachedAlbumIds = [];
  let cachedAlbumCount = 0; 

  albumIds.forEach(spotifyId => {
    const cacheKey = `album-${spotifyId}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
      albumDetails.push(cachedData);
      cachedAlbumCount++; 
    } else {
      uncachedAlbumIds.push(spotifyId);
    }
  });

  console.log(`${cachedAlbumCount} albums fetched from cache`);

  if (uncachedAlbumIds.length > 0) {
    try {
      const accessToken = await getSpotifyAccessToken();
      const batches = []; 
      const totalUncachedAlbums = uncachedAlbumIds.length;
      let apiCallCount = 0; 

      while (uncachedAlbumIds.length) {
        const batch = uncachedAlbumIds.splice(0, 20);
        apiCallCount++; 
        const batchPromise = axios.get(`https://api.spotify.com/v1/albums?ids=${batch.join(',')}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }).then(response => {
          response.data.albums.forEach(album => {
            const albumData = {
              id: album.id,
              name: album.name,
              artists: album.artists.map(artist => artist.name).join(', '),
              artistIds: album.artists.map(artist => artist.id),
              release_date: album.release_date,
              coverArtUrl: album.images.length > 0 ? album.images[0].url : undefined,
              type: album.album_type === 'album' ? 'Album' : 'Single/EP',
            };
            myCache.set(`album-${album.id}`, albumData); 
            albumDetails.push(albumData); 
          });
        });
        batches.push(batchPromise);
      }

      await Promise.all(batches);

      console.log(`${apiCallCount} API calls made to Spotify for ${totalUncachedAlbums} albums`);
      
    } catch (error) {
      console.error("Error fetching album details from Spotify:", error);
      return res.status(500).send("Internal server error");
    }
  }

  res.json(albumDetails);
});

module.exports = router;
