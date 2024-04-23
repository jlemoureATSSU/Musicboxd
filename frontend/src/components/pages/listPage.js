import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';
import getUserInfo from "../../utilities/decodeJwt";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ListPage = () => {
    const { listId } = useParams();
    const [listData, setListData] = useState(null);
    const [albumDetails, setAlbumDetails] = useState([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(0);
    const [userHasLiked, setUserHasLiked] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const fetchListData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/list/getListById/${listId}`);
                setListData(response.data);
                setLikeCount(response.data.likeCount);
                fetchAlbumsDetails(response.data.albums.map(album => album.id));
                if (currentUser) {
                    setUserHasLiked(response.data.likes.includes(currentUser.username));
                }
            } catch (error) {
                console.error('Error fetching list data:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${backendUrl}/comment/getAllByList/${listId}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments for list:', error);
            }
        };

        const userInfo = getUserInfo();
        setCurrentUser(userInfo);

        fetchListData();
        fetchComments();
    }, [listId, backendUrl]);

    useEffect(() => {
        if (listData && currentUser) {
            setUserHasLiked(listData.likes.includes(currentUser.username));
        }
    }, [listData, currentUser]);


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

    const handleLike = async () => {
        if (!currentUser) {
            alert('Please log in to like the list');
            return;
        }

        try {
            const url = `${backendUrl}/list/${userHasLiked ? 'unlike' : 'like'}`;
            const response = await axios.post(url, {
                username: currentUser.username,
                listId: listId,
            });

            if (response.status === 200) {
                setLikeCount(prev => userHasLiked ? prev - 1 : prev + 1);
                setUserHasLiked(!userHasLiked);
            }
        } catch (error) {
            console.error('Error liking/unliking the list:', error);
            alert(`Failed to ${userHasLiked ? 'unlike' : 'like'} the list. Please try again.`);
        }
    };


    const submitComment = async () => {
        if (!currentUser || !currentUser.username) {
            alert('Please log in to comment');
            return;
        }

        if (!comment.trim()) {
            alert('Comment cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/comment/submitToList`, {
                userName: currentUser.username,
                listId: listId,
                content: comment,
            });

            setComments([...comments, response.data]);
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Failed to submit comment. Please try again.');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`${backendUrl}/comment/deleteListComment/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
    };



    if (!listData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="create-list-page">
            <div className='all-sections'>
                <div className='list-details-and-like-section'>
                    <div className="list-details">
                        <div className='list-title-and-date'>
                            <div className="list-title">{listData.listName}</div>
                            <div className="list-date">
                                List created by<Link className='list-username' to={`/user/${listData.userName}`}>{listData.userName}</Link>{" "}
                                &middot; {new Date(listData.dateCreated).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })} &middot; {listData.albums.length} albums
                            </div>
                        </div>
                        <div className="list-description">
                            {listData.listDescription || "No Description"}
                        </div>
                    </div>
                    <span className="like-section">
                        <div onClick={handleLike} className="like-btn">
                            {likeCount} {userHasLiked ? <FaHeart className="fa-heart" /> : <FaRegHeart className="fa-heart" />}
                        </div>
                    </span>
                </div>
                {currentUser && (currentUser.username === listData.userName || currentUser.username === 'admin') && (
                    <div className="edit-list-actions">
                        <div onClick={() => navigate(`/edit/${listData._id}`)} className="edit-btn"> Edit</div>
                        <div onClick={() => deleteList(listData._id)} className="delete-btn"> Delete</div>
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
            <div className="list-comments-section">
                <div className='comments-header'>Comments</div>
                <div className="comments-container">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                                <span className="comment-user" onClick={() => navigate(`/user/${comment.userName}`)}>
                                    {comment.userName}
                                </span>
                                <span className="comment-date">
                                    {new Date(comment.dateCreated).toLocaleDateString()} at {new Date(comment.dateCreated).toLocaleTimeString()}
                                </span>
                                {currentUser && (currentUser.username === comment.userName || currentUser.username === 'admin') && (
                                    <span className="delete-comment-btn" onClick={() => deleteComment(comment._id)}>delete</span>
                                )}
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    ))}
                </div>
                <div className="comment-submission-section">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="comment-textarea"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submitComment();
                            }
                        }}
                    ></textarea>
                    <button
                        onClick={submitComment}
                        className="submit-comment-btn"
                    >Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListPage;