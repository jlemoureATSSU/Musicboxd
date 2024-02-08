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

    const fetchAlbumsDetails = async (albums) => {
        const details = await Promise.all(albums.map(album =>
            fetchAlbumDetailsFromSpotify(album.id)
        ));
        setAlbumDetails(details);
    };

    const fetchAlbumDetailsFromSpotify = async (spotifyAlbumId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/getAlbumDetails/${spotifyAlbumId}`);
            return response.data; 
        } catch (error) {
            console.error("Error fetching album details from backend:", error);
            return null;
        }
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
                    {albumDetails.map((album, index) => (
                        <AlbumCard
                            key={index}
                            coverArtUrl={album.coverArtUrl}
                            title={album.name}
                            artist={album.artists}
                            releaseDate={new Date(album.release_date).getFullYear()}
                            id={album.id} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListPage;