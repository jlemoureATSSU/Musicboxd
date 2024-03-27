import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CardDisplay from '../cardDisplay';
import { FaSpotify } from 'react-icons/fa';

const ArtistPage = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const [albums, setAlbums] = useState([]);
    const { artistSpotifyId } = useParams();
    const [relatedArtists, setRelatedArtists] = useState([]);
    const fetchInProgress = useRef(new Set());
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const fetchArtistAndAlbumIds = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/getAlbumsByArtist/${artistSpotifyId}`);
                setArtistDetails(response.data.artist);
                fetchAlbumDetails(response.data.albumIds);
            } catch (error) {
                console.error("Error fetching artist and album IDs", error);
            }
        };

        const fetchRelatedArtists = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/getRelatedArtists/${artistSpotifyId}`);
                setRelatedArtists(response.data);
            } catch (error) {
                console.error("Error fetching related artists", error);
            }
        };

        fetchArtistAndAlbumIds();
        fetchRelatedArtists();
    }, [artistSpotifyId]);

    const fetchAlbumDetails = async (albumIds) => {
        if (albumIds.length === 0) return;

        try {
            const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
                albumIds: albumIds
            });
            const sortedAlbums = detailsResponse.data.sort((a, b) => {
                return new Date(b.release_date) - new Date(a.release_date);
            });
            setAlbums(sortedAlbums);
        } catch (error) {
            console.error("Error fetching album details:", error);
        }
    };



    const getSpotifyAlbumUrl = (spotifyId) => {
        return `https://open.spotify.com/artist/${spotifyId}`;
    };

    return (
        <div className="album-page">
            <h1 className="artist-header">
                <div className='artist-name'>{artistDetails?.name || 'Artist'}</div>
                <button onClick={() => window.open(getSpotifyAlbumUrl(artistSpotifyId), '_blank')} className="spotify-link-btn2"><span className="spotify-green"><FaSpotify /></span></button>
            </h1>
            <div className="artist-page-container">
                <CardDisplay albums={albums} artistName={artistDetails?.name} />
                <div className='related-artists-container'>
                    <div>Similar Artists</div>
                    <div className='related-artists'>
                        {relatedArtists.map((artist) => (
                            <div key={artist.id} className='related-artist-card' onClick={() => navigate(`/artist/${artist.id}`)}>
                                <img src={artist.image} alt={artist.name} className='related-artist-image' />
                                <div className='related-artist-name'>{artist.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistPage;
