const express = require('express');
const router = express.Router();
const axios = require('axios');
const myCache = require('../../utilities/cache');
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.post('/getMultipleAlbumDetails', async (req, res) => {
  const { albumIds } = req.body; // Expecting an array of Spotify album IDs
  const albumDetails = [];
  const uncachedAlbumIds = [];
  let cachedAlbumCount = 0; 

  // Check cache for each album ID and collect uncached IDs
  albumIds.forEach(spotifyId => {
    const cacheKey = `album-${spotifyId}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
      albumDetails.push(cachedData);
      cachedAlbumCount++; // Increment cached album counter
    } else {
      uncachedAlbumIds.push(spotifyId);
    }
  });

  // Log the number of albums fetched from cache
  console.log(`${cachedAlbumCount} albums fetched from cache`);

  if (uncachedAlbumIds.length > 0) {
    try {
      const accessToken = await getSpotifyAccessToken();
      const batches = []; // To hold promises of batch requests
      const totalUncachedAlbums = uncachedAlbumIds.length; // Total number of albums being fetched
      let apiCallCount = 0; // Initialize API call counter

      while (uncachedAlbumIds.length) {
        // Spotify's batch limit is 20 albums per request
        const batch = uncachedAlbumIds.splice(0, 20);
        apiCallCount++; // Increment API call count for each batch request
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
            };
            myCache.set(`album-${album.id}`, albumData); // Cache the new album details
            albumDetails.push(albumData); // Add to final result
          });
        });
        batches.push(batchPromise);
      }

      // Wait for all batch requests to complete
      await Promise.all(batches);

      // After all batch requests complete, log the total API calls and albums fetched
      console.log(`${apiCallCount} API calls made to Spotify for ${totalUncachedAlbums} albums`);
      
    } catch (error) {
      console.error("Error fetching album details from Spotify:", error);
      return res.status(500).send("Internal server error");
    }
  }

  // Return combined results (cached and newly fetched)
  res.json(albumDetails);
});

module.exports = router;
