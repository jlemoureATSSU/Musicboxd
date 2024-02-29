import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard'; 
import getUserInfo from "../../utilities/decodeJwt"; 


const ListPage = () => {
    const { listId } = useParams();
    const [listData, setListData] = useState(null);
    const [albumDetails, setAlbumDetails] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); 
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const fetchListData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/list/getListById/${listId}`);
                setListData(response.data);
                fetchAlbumsDetails(response.data.albums.map(album => album.id));
            } catch (error) {
                console.error('Error fetching list data:', error);
            }
        };

        const userInfo = getUserInfo();
        setCurrentUser(userInfo);

        fetchListData();
    }, [listId]);

    const fetchAlbumsDetails = async (albumIds) => {
        if (albumIds.length === 0) return;

        try {
            const response = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
                albumIds: albumIds
            });
            setAlbumDetails(response.data);
        } catch (error) {
            console.error("Error fetching album details from backend:", error);
        }
    };
    

    if (!listData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="create-list-page">
            <div className="list-input-card">
                <h1 className="list-title-input">{listData.listName}</h1>
                <p className="list-date-input">
                    List created by {listData.userName}{" "}
                    {new Date(listData.dateCreated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
                <p className="list-description-input">{listData.listDescription}</p>
                {currentUser && currentUser.username === listData.userName && (
                    <button
                        onClick={() => navigate(`/createList/${listData._id}`)}
                        className="edit-btn"
                    >
                        Edit List
                    </button>
                )}
            </div>
            <div className="album-list-card">
                    {albumDetails.map((album) => (
                        <AlbumCard
                            key={album.id}
                            coverArtUrl={album.coverArtUrl}
                            title={album.name}
                            artist={album.artists}
                            artistIds={album.artistIds}
                            releaseDate={new Date(album.release_date).getFullYear()}
                            spotifyId={album.id}
                            isClickable={true}
                        />
                    ))}
            </div>
        </div>
    );
    
};

export default ListPage;