const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Define the route for fetching album details and cover art
router.get('/getAlbumDetails/:mbid', async (req, res) => {
  const { mbid } = req.params;
  let cachedResponse = myCache.get(mbid);
  if (cachedResponse) {
    return res.json(cachedResponse);
  }
  const userAgent = 'Musicboxd (joelem316@gmail.com)'; // Adjust with your actual User-Agent

  try {
    const detailsPromise = axios.get(`https://musicbrainz.org/ws/2/release-group/${mbid}?fmt=json&inc=artist-credits+releases`, {
      headers: { 'User-Agent': userAgent }
    });
    const coverArtPromise = axios.get(`http://coverartarchive.org/release-group/${mbid}`, {
      headers: { 'User-Agent': userAgent }
    }).catch(() => ({ data: { images: [] } })); // Gracefully handle no cover art

    const [detailsResponse, coverResponse] = await Promise.all([detailsPromise, coverArtPromise]);

    const albumDetails = {
      details: detailsResponse.data,
      coverArtUrl: coverResponse.data.images.length > 0 ? coverResponse.data.images[0].image : undefined
    };

    myCache.set(mbid, albumDetails);

    res.json(albumDetails);
  } catch (error) {
    console.error("Error fetching album details:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
