import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard'; 

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

    const fetchAlbumDetailsFromBackend = async (mbid) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/getAlbumDetails/${mbid}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching album details from backend", error);
            return null; 
        }
    };

    const fetchAlbumsDetails = async (albums) => {
        const details = await Promise.all(albums.map(album => fetchAlbumDetailsFromBackend(album.id)));
        const validDetails = details.filter(detail => detail !== null);
        setAlbumDetails(validDetails);
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
                            key={album.details.id || album.id}
                            coverArtUrl={album.coverArtUrl}
                            title={album.details.title}
                            artist={album.details['artist-credit'] ? album.details['artist-credit'][0].name : 'Unknown Artist'}
                            releaseDate={album.details['first-release-date'] ? new Date(album.details['first-release-date']).getFullYear() : 'Unknown Year'}
                            mbid={album.details.id || album.id} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListPage;
