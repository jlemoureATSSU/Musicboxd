// ArtistPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CardDisplay from '../cardDisplay'; 

const ArtistPage = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const [albums, setAlbums] = useState([]);
    const { artistSpotifyId } = useParams();

    useEffect(() => {
        const fetchArtistAndAlbums = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/getAlbumsByArtist/${artistSpotifyId}`);
                setArtistDetails(response.data.artist);
                setAlbums(response.data.albums);
            } catch (error) {
                console.error("Error fetching artist and albums", error);
            }
        };

        fetchArtistAndAlbums();
    }, [artistSpotifyId]);

    const getSpotifyAlbumUrl = (spotifyId) => {
        return `https://open.spotify.com/artist/${artistSpotifyId}`;
    };

    
    return (
        <div>
            <h1 className="artist-header">{artistDetails?.name || 'Artist'}
                <button onClick={() => window.open(getSpotifyAlbumUrl(artistSpotifyId), '_blank')} className="spotify-link-btn">Open in <span className="spotify-green">Spotify</span></button>
            </h1>
            <CardDisplay albums={albums} artistName={artistDetails?.name} />
        </div>
    );
};

export default ArtistPage;

