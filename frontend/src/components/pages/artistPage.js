import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CardDisplay from '../cardDisplay';
import { FaSpotify } from 'react-icons/fa';

const ArtistPage = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const [albums, setAlbums] = useState([]);
    const { artistSpotifyId } = useParams();
    const fetchInProgress = useRef(new Set()); // Tracks which album details are being fetched
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const fetchArtistAndAlbumIds = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/getAlbumsByArtist/${artistSpotifyId}`);
                setArtistDetails(response.data.artist);
                // Fetch album details with the received IDs
                fetchAlbumDetails(response.data.albumIds);
            } catch (error) {
                console.error("Error fetching artist and album IDs", error);
            }
        };

        fetchArtistAndAlbumIds();
    }, [artistSpotifyId]);

    const fetchAlbumDetails = async (albumIds) => {
        if (albumIds.length === 0) return; // Early return if there are no IDs to fetch
    
        try {
            // Make a single POST request with all album IDs
            const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
                albumIds: albumIds
            });
            // Sort albums by release date before updating the albums state
            const sortedAlbums = detailsResponse.data.sort((a, b) => {
                // Assuming release_date is in YYYY-MM-DD format; adjust if necessary
                return new Date(b.release_date) - new Date(a.release_date);
            });
            // Update the albums state with the sorted details
            setAlbums(sortedAlbums);
        } catch (error) {
            console.error("Error fetching album details:", error);
        }
    };
    
    

    const getSpotifyAlbumUrl = (spotifyId) => {
        return `https://open.spotify.com/artist/${spotifyId}`;
    };

    return (
        <div>
            <h1 className="artist-header">{artistDetails?.name || 'Artist'} ({albums.length} Albums)
            <button onClick={() => window.open(getSpotifyAlbumUrl(artistSpotifyId), '_blank')} className="spotify-link-btn2">Open in <span className="spotify-green"><FaSpotify /></span></button>
            </h1>
            <CardDisplay albums={albums} artistName={artistDetails?.name} />
        </div>
    );
};

export default ArtistPage;
