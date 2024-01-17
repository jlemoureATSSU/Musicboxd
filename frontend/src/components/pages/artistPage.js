import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';
import AlbumCard from '../albumCard';


const ArtistPage = () => {
    const [albums, setAlbums] = useState([]);
    const [artistName, setArtistName] = useState('');
    const { mbid } = useParams();

    useEffect(() => {
        fetchArtistName(mbid);
        fetchAlbums(mbid);
    }, [mbid]);

    const fetchArtistName = async (artistMBID) => {
        try {
            const response = await axios.get(`https://musicbrainz.org/ws/2/artist/${artistMBID}?fmt=json`, {
                headers: {
                    'User-Agent': 'Musicboxd (joelem316@gmail.com)'
                }
            });
            setArtistName(response.data.name);
        } catch (error) {
            console.error("Error fetching artist name", error);
        }
    };

    const fetchCoverArt = async (albumMBID) => {
        try {
            const coverResponse = await axios.get(`http://coverartarchive.org/release-group/${albumMBID}`);
            return coverResponse.data.images[0].image; // Return the URL of the first image
        } catch (error) {
            console.error("Error fetching cover art", error);
            return ''; // Return empty string if no cover art is found
        }
    };

    const fetchAlbums = async (artistMBID) => {
        try {
            const response = await axios.get('https://musicbrainz.org/ws/2/release-group', {
                params: {
                    artist: artistMBID,
                    type: 'album',
                    fmt: 'json',
                    inc: 'artist-credits'
                },
                headers: {
                    'User-Agent': 'Musicboxd (joelem316@gmail.com)'
                }
            });
    
            const sortedAlbums = response.data['release-groups']
                .filter(rg => rg['primary-type'] === 'Album' && (!rg['secondary-types'] || rg['secondary-types'].length === 0))
                .map(album => ({
                    ...album,
                    artist: album['artist-credit'] ? album['artist-credit'].map(ac => ac.name).join(', ') : '',
                    releaseDate: album['first-release-date'] || 'Unknown Date'
                }))
                .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    
            const albumsWithCoverArt = await Promise.all(sortedAlbums.map(async album => {
                const coverArtUrl = await fetchCoverArt(album.id);
                return {
                    ...album,
                    coverArtUrl
                };
            }));
    
            setAlbums(albumsWithCoverArt);
        } catch (error) {
            console.error("Error fetching albums", error);
        }
    };
    
    return (
        <div className='main'>
            <h1>{artistName}</h1>
            <div className="albums-container">
                {albums.map((album) => (
                    <AlbumCard
                        key={album.id}
                        mbid={album.id}
                        coverArtUrl={album.coverArtUrl}
                        title={album.title}
                        artist={album.artist}
                        releaseDate={album.releaseDate !== 'Unknown Date' ? new Date(album.releaseDate).toLocaleDateString('en-US', { year: 'numeric'}) : 'Unknown Date'}
                    />
                ))}
            </div>
        </div>
    );
};

export default ArtistPage;
