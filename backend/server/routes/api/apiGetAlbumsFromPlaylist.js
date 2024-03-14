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
    
    const albumDetailsResponses = await Promise.all(albumIds.map(id =>
      axios.get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
    ));
    
    const albums = albumDetailsResponses.map(response => {
        const releaseDateFormatted = response.data.release_date
          ? new Date(response.data.release_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : 'Unknown Date';
      
        return {
          id: response.data.id,
          name: response.data.name,
          artist: response.data.artists.map(artist => artist.name).join(', '),
          releaseDate: releaseDateFormatted,
          coverArtUrl: response.data.images[0]?.url || ''
        };
      });
      
      

    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums from Spotify playlist:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
