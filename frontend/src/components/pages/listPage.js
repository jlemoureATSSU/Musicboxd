import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard'; // Adjust the path as necessary

const ListPage = () => {
    const { listId } = useParams();
    const [listData, setListData] = useState(null);
    const [albumDetails, setAlbumDetails] = useState([]);

    useEffect(() => {
        const fetchListData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/list/getListById/${listId}`);
                setListData(response.data);
                fetchAlbumsDetails(response.data.albums);
            } catch (error) {
                console.error('Error fetching list data:', error);
            }
        };

        fetchListData();
    }, [listId]);

    const fetchAlbumDetails = async (albumId) => {
        try {
            const response = await axios.get(`https://musicbrainz.org/ws/2/release-group/${albumId}?inc=artist-credits&fmt=json`, {
                headers: { 'User-Agent': 'Musicboxd (joelem316@gmail.com)' }
            });
            const album = response.data;
            const coverArtUrl = await fetchCoverArt(albumId);
            return {
                id: albumId,
                title: album.title,
                artist: album['artist-credit'] ? album['artist-credit'][0].name : 'Unknown Artist',
                year: album['first-release-date'] ? new Date(album['first-release-date']).getFullYear() : 'Unknown Year',
                coverArtUrl
            };
        } catch (error) {
            console.error("Error fetching album details", error);
            return { id: albumId, title: '', artist: '', year: '', coverArtUrl: '' };
        }
    };

    const fetchCoverArt = async (albumMBID) => {
        try {
            const coverResponse = await axios.get(`http://coverartarchive.org/release-group/${albumMBID}`);
            return coverResponse.data.images[0].image;
        } catch (error) {
            console.error("Error fetching cover art", error);
            return '';
        }
    };

    const fetchAlbumsDetails = async (albums) => {
        const details = await Promise.all(albums.map(album => fetchAlbumDetails(album.id)));
        setAlbumDetails(details);
    };

    if (!listData) {
        return <div>Loading...</div>;
    }


    return (
        <div className="create-list-page">
            <div className="list-input-card">
                <h1 className="list-title-input">{listData.listName} created by {listData.userName}</h1>
                <p className="list-description-input">{listData.listDescription}</p>
            </div>
            <div className="album-list-card">
                <div className="album-list">
                    {albumDetails.map((album) => (
                        <AlbumCard
                            key={album.id}
                            coverArtUrl={album.coverArtUrl}
                            title={album.title}
                            artist={album.artist}
                            releaseDate={album.year}
                            mbid={album.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListPage;
