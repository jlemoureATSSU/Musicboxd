import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';

const AlbumPage = () => {
    const [albumDetails, setAlbumDetails] = useState(null);
    const [coverArtUrl, setCoverArtUrl] = useState('');
    const { mbid } = useParams();

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const detailsResponse = await axios.get(`https://musicbrainz.org/ws/2/release-group/${mbid}?fmt=json&inc=artist-credits+releases`, {
                    headers: {
                        'User-Agent': 'Musicboxd (joelem316@gmail.com)'
                    }
                });
                setAlbumDetails(detailsResponse.data);

                // Fetch cover art
                const coverResponse = await axios.get(`http://coverartarchive.org/release-group/${mbid}`, {
                    headers: {
                        'User-Agent': 'Musicboxd (joelem316@gmail.com)'
                    }
                });
                if (coverResponse.data.images && coverResponse.data.images.length > 0) {
                    setCoverArtUrl(coverResponse.data.images[0].image);
                }
            } catch (error) {
                console.error("Error fetching album details", error);
            }
        };

        fetchAlbumDetails();
    }, [mbid]);

    if (!albumDetails) {
        return <div>Loading...</div>;
    }

    const artist = albumDetails['artist-credit']?.map(ac => ac.name).join(', ') ?? 'Unknown Artist';
    const title = albumDetails.title || 'Unknown Title';
    const releaseDate = albumDetails['first-release-date'] || 'Unknown Release Date';

    return (
        <div className='main'>
            <AlbumCard
              coverArtUrl={coverArtUrl}
              title={title}
              artist={artist}
              releaseDate={releaseDate !== 'Unknown Date' ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date'}
              mbid={mbid}
            />
        </div>
    );
};

export default AlbumPage;