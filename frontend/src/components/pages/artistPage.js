import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AlbumCard from '../albumCard';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa';

const ArtistPage = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const [content, setContent] = useState([]); // Generic state for either albums or singles & EPs
    const { artistSpotifyId } = useParams();
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [contentType, setContentType] = useState('albums'); // State to control whether albums or singles & EPs are shown
    const fetchInProgress = useRef(new Set());
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${backendUrl}/api/getAlbumsByArtist/${artistSpotifyId}`;
                if (contentType === 'singlesEps') {
                    url = `${backendUrl}/api/getSinglesByArtist/${artistSpotifyId}`;
                }
                const response = await axios.get(url);
                setArtistDetails(response.data.artist);
                fetchDetails(response.data.albumIds || response.data.singleEpsIds);
            } catch (error) {
                console.error(`Error fetching ${contentType}`, error);
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

        fetchData();
        fetchRelatedArtists();
    }, [artistSpotifyId, contentType]);

    const fetchDetails = async (ids) => {
        if (ids.length === 0) return;

        try {
            const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
                albumIds: ids
            });
            const sortedContent = detailsResponse.data.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            setContent(sortedContent);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    const getSpotifyAlbumUrl = (spotifyId) => `https://open.spotify.com/artist/${spotifyId}`;

    return (
        <div className="album-page">
            <h1 className="artist-header">
                <div className='artist-name'>{artistDetails?.name || 'Artist'}</div>
                <a onClick={() => window.open(getSpotifyAlbumUrl(artistSpotifyId))} className="spotify-btn" target="_blank" rel="noopener noreferrer"><FaSpotify /></a>
            </h1>
            <div className="artist-page-container">
                <div className="artist-albums-container">
                    <div className="content-toggle-buttons">
                        <button onClick={() => setContentType('albums')} className={`sort-button ${contentType === 'albums' ? 'active' : ''}`}>Albums</button>
                        <button onClick={() => setContentType('singlesEps')} className={`sort-button ${contentType === 'singlesEps' ? 'active' : ''}`}>Singles</button>
                    </div>
                    {content.map((album) => (
                        <AlbumCard
                            key={album.id}
                            spotifyId={album.id}
                            coverArtUrl={album.coverArtUrl}
                            title={album.name}
                            artist={album.artists}
                            artistIds={album.artistIds}
                            releaseDate={new Date(album.release_date).getFullYear()}
                            averageRating={album.averageRating}
                            numberOfRatings={album.numberOfRatings}
                            type={album.type}
                            isClickable={true}
                        />
                    ))}
                </div>
                <div className='related-artists-container'>
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
