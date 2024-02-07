const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route for searching artists
router.get('/searchArtists', async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const response = await axios.get(`https://musicbrainz.org/ws/2/artist/?query=${searchQuery}&fmt=json&limit=7`, {
      headers: { 'User-Agent': 'YourAppName/1.0 (yourEmail@example.com)' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching artists: ', error);
    res.status(500).send('Error fetching artist data');
  }
});


module.exports = router;
