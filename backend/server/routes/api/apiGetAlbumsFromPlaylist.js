const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getSpotifyAccessToken } = require('../../utilities/apiGetAccessToken');

router.get('/getAlbumsFromPlaylist', async (req, res) => {
  const playlistUrl = req.query.url;
  const playlistIdMatch = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
  
  if (!playlistIdMatch) {
    return res.status(400).json({ message: 'Invalid Spotify playlist URL' });
  }

  const playlistId = playlistIdMatch[1];
  try {
    const accessToken = await getSpotifyAccessToken();
    const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: { fields: 'items(track(album(id)))' }
    });

    const albumIds = [...new Set(tracksResponse.data.items.map(item => item.track.album.id))];
    
    res.json({ albumIds }); // Return only the album IDs
  } catch (error) {
    console.error("Error fetching albums from Spotify playlist:", error);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
