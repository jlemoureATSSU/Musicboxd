import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import getUserInfo from "../../utilities/decodeJwt";
import {FaSpotify} from 'react-icons/fa';


const AlbumPage = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [albumDetails, setAlbumDetails] = useState(null);
    const artistId = albumDetails && albumDetails.artistIds.length > 0 ? albumDetails.artistIds[0] : null;
    const [userLists, setUserLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [albumListCount, setAlbumListCount] = useState(0);
    const [rating, setRating] = useState('');
    const [ratingMessageKey, setRatingMessageKey] = useState(0);
    const [submitMessage, setSubmitMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [averageRating, setAverageRating] = useState('');
    const [numberOfRatings, setNumberOfRatings] = useState(0);
    const { spotifyId } = useParams();
    const user = getUserInfo();
    const [comment, setComment] = useState('');
    const [commentSubmitMessage, setCommentSubmitMessage] = useState('');
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        console.log("Spotify ID:", spotifyId);
        setRating('');
        setAverageRating('');
        setNumberOfRatings(0);
        const fetchAlbumDetailsFromSpotify = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/getAlbumDetails/${spotifyId}`);
                console.log(response.data);
                setAlbumDetails(response.data);
            } catch (error) {
                console.error("Error fetching album details from backend", error);
            }
           
        };
    
        fetchAlbumDetailsFromSpotify();
    }, [spotifyId]);


    useEffect(() => {
        const fetchAlbumDetailsAndRatingFromMongo = async () => {

            try {
                const listCountResponse = await axios.get(`${backendUrl}/list/albumInListsCount/${spotifyId}`);
                setAlbumListCount(listCountResponse.data.count);
            } catch (error) {
                console.error("Error fetching album list count", error);
            }
            try {
                const ratingResponse = await axios.get(`${backendUrl}/rating/getByUserAndAlbum/${user.username}/${spotifyId}`);
                if (ratingResponse.data && ratingResponse.data.ratingNum !== undefined) {
                    const userRating = ratingResponse.data.ratingNum;
                    const formattedRating = userRating === 10 ? '10' : userRating.toFixed(1);
                    setRating(formattedRating);
                } else {
                    setRating('');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setRating('');
                } else {
                    console.error("Error fetching user's rating for album", error);
                }
            }
            try {
                const avgRatingResponse = await axios.get(`${backendUrl}/rating/getAvgByAlbum/${spotifyId}`);
                if (avgRatingResponse.data && avgRatingResponse.data.averageRating !== undefined) {
                    const avgRating = avgRatingResponse.data.averageRating;
                    const formattedAvgRating = avgRating === 10 ? '10' : avgRating.toFixed(1);
                    setAverageRating(formattedAvgRating);
                    setNumberOfRatings(avgRatingResponse.data.numberOfRatings);
                } else {
                    setAverageRating('NR');
                }
            } catch (error) {
                console.error("Error fetching average rating for album", error);
            }
            try {
                const commentsResponse = await axios.get(`${backendUrl}/comment/getAllByAlbum/${spotifyId}`);
                setComments(commentsResponse.data); 
            } catch (error) {
                console.error("Error fetching comments for album", error);
            }


            };

            let fadeOutTimer;
            if (showMessage) {
                const timer = setTimeout(() => {
                    const messageDiv = document.querySelector('.rating-message');
                    if (messageDiv) {
                        messageDiv.classList.add('fade-out');
                    }
                    fadeOutTimer = setTimeout(() => {
                        setShowMessage(false);
                        messageDiv.classList.remove('fade-out');
                    }, 500);
                }, 3000);

                return () => {
                    clearTimeout(timer);
                    clearTimeout(fadeOutTimer);
                };
            }
            fetchAlbumDetailsAndRatingFromMongo();
        }, [spotifyId, showMessage]);
            
    
    

    const fetchUserLists = async () => {
        try {
            const response = await axios.get(`${backendUrl}/list/getAllListsByUser/${user.username}`);
            setUserLists(response.data);
            setShowModal(true); 
        } catch (error) {
            console.error("Error fetching user's lists", error);
        }
    };

    const addAlbumToList = async (listId) => {
        if (!user || !user.username) {
            displayMessage('Create an account and Log In to add albums to Lists');
            return;
          }

        const albumId = spotifyId;
        try {
          await axios.post(`${backendUrl}/list/addAlbumToList/${listId}`, { albumId });
          setShowModal(false);
          setAlbumListCount(albumListCount + 1);
          setTimeout(() => {
            displayMessage('Album added to List!');
          }, 0);
        } catch (error) {
          console.error('Error adding album to List:', error);
          setShowModal(false);
          setTimeout(() => {
            displayMessage('Album already in List!');
          }, 0);
        }
      };
    
      const handleRatingChange = (e) => {
        let value = e.target.value;
        const singleDigit = /^[0-9]$/;
        const lastChar = value.slice(-1);
        const secondLastChar = value.slice(-2, -1);
    
        if (lastChar === '' && secondLastChar === '.') {
            value = value.slice(0, -2);
        }
            if (singleDigit.test(value) && e.nativeEvent.data === '0') {
            value = value.includes('.') ? value + '0' : value;
        } else if (value.length === 2 && value.charAt(1) !== '0' && !value.includes('.')) {
            value = value.charAt(0) + '.' + value.charAt(1);
        } else if (value.startsWith('10')) {
            value = '10';
        }
    
        if (value === '.' || /^(10|[0-9])?(\.[0-9]?)?$/.test(value)) {
            const numValue = parseFloat(`0${value}`);
            if ((numValue >= 0 && numValue <= 10) || value === '') {
                setRating(value);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && rating.includes('.') && rating.length - rating.indexOf('.') === 2) {
            setRating(rating.slice(0, -2));
            e.preventDefault();
        }
    };

    const submitRating = async () => {
        let processedRating = rating.endsWith('.') ? rating.slice(0, -1) : rating;
        const numRating = parseFloat(processedRating);
    
        if (processedRating === '' || isNaN(numRating) || numRating < 0 || numRating > 10) {
            setSubmitMessage('Please enter a valid rating from 0 to 10.');
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/rating/save`, {
                userName: user.username,
                ratingNum: numRating,
                albumId: spotifyId, 
            });

            setSubmitMessage('Rating saved!');
            setTimeout(() => {
                displayMessage('Rating saved!');
            }, 0);
        } catch (error) {
            setSubmitMessage('');
            setTimeout(() => {
                displayMessage('Please Log in to submit Ratings');
            }, 0);
        }
    };

    const handleRatingSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            submitRating();
        }
    };

      

    if (!albumDetails) {
        return <div>Loading...</div>;
    }

    const displayMessage = (message) => {
        const newKey = new Date().getTime();
        setRatingMessageKey(newKey);
        setSubmitMessage(message);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    const getRatingClassName = (ratingValue) => {
        if (ratingValue === 'No rating yet') return '';
        const numRating = parseFloat(ratingValue);
        if (isNaN(numRating)) return '';
        
        if (numRating <= 4.9) return 'rating-red';
        if (numRating >= 5 && numRating <= 7.4) return 'rating-orange';
        if (numRating >= 7.5) return 'rating-green';
    };
    
    const artist = albumDetails.artists ?? 'Unknown Artist';
    const title = albumDetails.name || 'Unknown Title';
    const releaseDate = albumDetails.release_date || 'Unknown Release Date';
    let formattedReleaseDate = 'Unknown Release Date';
    if (releaseDate && releaseDate !== 'Unknown Release Date') {
      formattedReleaseDate = new Date(releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      });
    }

    const artistLink = artistId ? (
        <Link to={`/artist/${artistId}`} className="album-artist-link">
          {albumDetails.artists}
        </Link>
      ) : 'Unknown Artist';
  

    const getSpotifyAlbumUrl = (spotifyId) => {
        return `https://open.spotify.com/album/${spotifyId}`;
      };

      const submitComment = async () => {
        if (!user || !user.username) {
            displayMessage('Please log in to comment');
            setComment('');
            return;
        }
    
        if (!comment.trim()) {
            setCommentSubmitMessage('Comment cannot be empty.');
            return;
        }
    
        try {
            const response = await axios.post(`${backendUrl}/comment/submit`, {
                userName: user.username,
                albumId: spotifyId,
                content: comment,
            });
            
            setComments([...comments, response.data]);
            setComment('');
    
        } catch (error) {
            console.error('Error submitting comment:', error);
            setCommentSubmitMessage('Failed to submit comment. Please try again.');
        }
    };

    const createNewListWithAlbum = async () => {
        if (!user || !user.username) {
          displayMessage('Please sign up and log in to create Lists');
          setShowModal(false);
          return;
        }
      
        const listName = `${albumDetails.name}`; 
        try {
          const response = await axios.post(`${backendUrl}/list/save`, {
            userName: user.username,
            listName: listName,
            albums: [{ id: spotifyId }],
          });
      
          displayMessage(`List created!`);
          setShowModal(false); 
        } catch (error) {
          console.error('Error creating new list:', error);
          displayMessage('Failed to create a new list');
        }
    };      
    
    return (
        <div className='album-page'>
            <div className="album-header">
                {title}
                <button onClick={() => window.open(getSpotifyAlbumUrl(spotifyId), '_blank')} className="spotify-link-btn">
                    <span className="spotify-green">
                        <FaSpotify />
                    </span>
                </button>
            </div>
            <div className="album-page-container">
                <div className="album-details-wrapper">
                    <div className="album-details">
                        <img src={albumDetails.coverArtUrl} alt={`${title} cover art`} className="album-cover-art" />
                        <div className="album-info">
                            <div className="album-artist"><span style={{ color: 'white' }}> by </span>{artistLink}</div>
                            <div className="album-release-date"> Released: {formattedReleaseDate} </div>
                        </div>
                    </div>
                </div>

                <div className="album-info-wrapper">
                    <div className="rating-box">
                        <div className="submit-rating-title">Average Rating:</div>
                        <div className={`rating-input ${getRatingClassName(averageRating)}`}>
                            {numberOfRatings > 0 ? averageRating : 'NR'}
                        </div>
                        {numberOfRatings > 0 ? (
                            <div className='rating-title'>From {numberOfRatings} <u><b>Musicboxd</b></u> user rating(s)</div>
                        ) : (
                            <div className='rating-title'>Be the first to rate this album!</div>
                        )}
                    </div>


                    <div className='list-count'>This album appears in {albumListCount} user-created List(s)</div>
                    <div key={ratingMessageKey} className={`rating-message ${submitMessage ? 'visible' : ''}`}>
                        {submitMessage}
                    </div>
                </div>

                <div className="album-actions-wrapper">
                    <div className="submit-rating-box">
                        <div className="submit-rating-title">Your Rating:</div>
                        <input
                            type="text"
                            className={`submit-rating-input ${getRatingClassName(rating)}`}
                            value={rating}
                            onChange={handleRatingChange}
                            onKeyPress={handleRatingSubmit}
                            onKeyDown={handleKeyDown}
                            placeholder="-"
                        />
                        <button
                            className="submit-rating-btn"
                            onClick={handleRatingSubmit}
                        >
                            Submit Rating
                        </button>
                    </div>
                    <button onClick={user && user.username ? fetchUserLists : () => displayMessage('Sign Up and Log In to create Lists')} className="add-album-btn">Add to a <b>List</b></button>
                    <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="album-modal">
                        <Modal.Header>
                            <Modal.Title style={{ width: '100%', fontSize: '18px'}}>add {title} by {artist} to...</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {userLists.map(list => (
                                <Button
                                    key={list._id}
                                    onClick={() => addAlbumToList(list._id)}
                                    className="list-select-btn"
                                    variant="outline-secondary"
                                >
                                    <span style={{ fontSize: '17px'}}>{list.listName}</span><span style={{fontSize: '14px', color : 'grey'}}>{list.dateCreated ? ` (${new Date(list.dateCreated).toLocaleDateString()})` : ''}</span>
                                </Button>
                            ))}
                        </Modal.Body>
                        <Modal.Footer> 
                            <div onClick={createNewListWithAlbum} className="new-list-btn">Add to a new List</div>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="comments-section">
                    <div className='comments-header'>Comments</div>
                    <div className="comments-container">
                        {comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <div className="comment-header">
                                    <span className="comment-user" onClick={() => navigate(`/user/${comment.userName}`)}>{comment.userName}</span>
                                    <span className="comment-date">
                                        {new Date(comment.dateCreated).toLocaleDateString()} {new Date(comment.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
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
        </div>
    );
};
export default AlbumPage;