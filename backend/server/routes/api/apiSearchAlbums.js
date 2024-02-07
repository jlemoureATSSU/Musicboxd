const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route for searching albums
router.get('/searchAlbums', async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const response = await axios.get(`https://musicbrainz.org/ws/2/release-group/?query=${searchQuery}&fmt=json&limit=7&type=album`, {
      headers: { 'User-Agent': 'YourAppName/1.0 (yourEmail@example.com)' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching albums: ', error);
    res.status(500).send('Error fetching album data');
  }
});

module.exports = router;