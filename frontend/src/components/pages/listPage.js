import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

    const deleteList = async (listId) => {
        if (window.confirm("Are you sure you want to delete this list?")) {
            try {
                const response = await fetch(`${backendUrl}/list/delete/${listId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("List deleted successfully.");
                    navigate('/lists');
                } else {
                    alert("Failed to delete the list.");
                }
            } catch (error) {
                console.error("Error deleting the list: ", error);
                alert("An error occurred while trying to delete the list.");
            }
        }
    };
    
    return (
        <div className="create-list-page">
            <div> 
                <div className="list-details">
                    <div className='list-title-and-date'>
                        <div className="list-title">{listData.listName}</div>
                        <div className="list-date">
                            List created by<Link className='list-card-username' to={`/user/${listData.userName}`}>{listData.userName}</Link>{" "}
                            {new Date(listData.dateCreated).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </div>
                    </div>
                    <div className="list-description">
                        {listData.listDescription || "No Description"}
                    </div>
                </div>
                
                {currentUser && currentUser.username === listData.userName && (
                    <div className="list-actions">
                        <div onClick={() => navigate(`/edit/${listData._id}`)} className="edit-btn"> Edit List</div>
                        <div onClick={() => deleteList(listData._id)} className="delete-btn"> Delete List</div>
                    </div>
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
                            type={album.type}
                            isClickable={true}
                        />
                    ))}
            </div>
        </div>
    );
    
};

export default ListPage;