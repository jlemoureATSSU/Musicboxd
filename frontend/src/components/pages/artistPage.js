import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AlbumCard from '../albumCard';

const ArtistPage = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const [albums, setAlbums] = useState([]);
    const { artistSpotifyId } = useParams(); 

    console.log("Artist Spotify ID on ArtistPage:", artistSpotifyId);

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
            <h1 className="artist-header">{artistDetails?.name|| 'Artist'}
            <button onClick={() => window.open(getSpotifyAlbumUrl(artistSpotifyId), '_blank')} className="spotify-link-btn">Open in <span className="spotify-green">Spotify</span></button>
            </h1>
            <div className="albums-container">
                {albums.map((album) => (
                    <AlbumCard
                        key={album.id}
                        spotifyId={album.id}
                        coverArtUrl={album.coverArtUrl}
                        title={album.name}
                        artist={artistDetails?.name || 'Various Artists'}
                        releaseDate={new Date(album.release_date).toLocaleDateString('en-US', { year: 'numeric'})}
                    />
                ))}
            </div>
        </div>
    );
};

export default ArtistPage;
