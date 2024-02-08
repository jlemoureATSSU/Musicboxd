const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

async function getSpotifyAccessToken() {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await axios.post(tokenEndpoint, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token: ', error);
    throw error;
  }
}

module.exports = { getSpotifyAccessToken };
