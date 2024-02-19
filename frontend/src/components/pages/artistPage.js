import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CardDisplay from '../cardDisplay';

const ArtistPage = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const [albums, setAlbums] = useState([]);
    const { artistSpotifyId } = useParams();
    const fetchInProgress = useRef(new Set()); // Tracks which album details are being fetched

    useEffect(() => {
        const fetchArtistAndAlbumIds = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/getAlbumsByArtist/${artistSpotifyId}`);
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
        albumIds.forEach(async (albumId) => {
            if (fetchInProgress.current.has(albumId)) {
                return; // Skip if fetch is in progress
            }

            fetchInProgress.current.add(albumId);

            try {
                const detailsResponse = await axios.get(`http://localhost:8081/api/getAlbumDetails/${albumId}`);
                setAlbums(prevAlbums => [...prevAlbums, detailsResponse.data]);
            } catch (error) {
                console.error("Error fetching album details for ID:", albumId, error);
            } finally {
                fetchInProgress.current.delete(albumId);
            }
        });
    };

    const getSpotifyAlbumUrl = (spotifyId) => {
        return `https://open.spotify.com/artist/${spotifyId}`;
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
