import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import getUserInfo from "../../utilities/decodeJwt";


const AlbumPage = () => {
    const [albumDetails, setAlbumDetails] = useState(null);
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

    useEffect(() => {
        console.log("Spotify ID:", spotifyId);
        const fetchAlbumDetailsFromSpotify = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/getAlbumDetails/${spotifyId}`);
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
                const listCountResponse = await axios.get(`http://localhost:8081/list/albumInListsCount/${spotifyId}`);
                setAlbumListCount(listCountResponse.data.count);
            } catch (error) {
                console.error("Error fetching album list count", error);
            }
            try {
                const ratingResponse = await axios.get(`http://localhost:8081/rating/getByUserAndAlbum/${user.username}/${spotifyId}`);
                if (ratingResponse.data && ratingResponse.data.ratingNum !== undefined) {
                  setRating(ratingResponse.data.ratingNum.toString());
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
                const avgRatingResponse = await axios.get(`http://localhost:8081/rating/getAvgByAlbum/${spotifyId}`);
                if (avgRatingResponse.data && avgRatingResponse.data.averageRating && avgRatingResponse.data.numberOfRatings !== undefined) {
                    setAverageRating(avgRatingResponse.data.averageRating.toFixed(1)); 
                    setNumberOfRatings(avgRatingResponse.data.numberOfRatings);
                } else {
                    setAverageRating('No rating yet');
                }
            } catch (error) {
                console.error("Error fetching average rating for album", error);
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
                }, 2500);

                return () => {
                    clearTimeout(timer);
                    clearTimeout(fadeOutTimer);
                };
            }
            fetchAlbumDetailsAndRatingFromMongo();
        }, [spotifyId, showMessage]);
            
    
    

    const fetchUserLists = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/list/getAllListsByUser/${user.username}`);
            setUserLists(response.data);
            setShowModal(true); 
        } catch (error) {
            console.error("Error fetching user's lists", error);
        }
    };

    const addAlbumToList = async (listId) => {
        const albumId = spotifyId; 
        try {
          await axios.post(`http://localhost:8081/list/addAlbumToList/${listId}`, { albumId });
          setShowModal(false);
          setAlbumListCount(albumListCount + 1);
        } catch (error) {
          console.error('Error adding album to list:', error);
        }
      };

      const handleRatingChange = (e) => {
        const value = e.target.value;
        const regex = /^(10|[0-9])?(\.[0-9]?)?$/; 
    
        if (value === '' || regex.test(value)) {
            const numValue = parseFloat(value);
            if ((numValue >= 0 && numValue <= 10) || value === '') {
                setRating(value);
            }
        }
    };
    

    const submitRating = async () => {
        const numRating = parseFloat(rating);
        if (rating === '' || isNaN(numRating) || numRating < 0 || numRating > 10 || !/^\d+(\.\d)?$/g.test(rating)) {
            setSubmitMessage('Please enter a valid rating from 0 to 10, with at most one decimal place.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/rating/save', {
                userName: user.username,
                ratingNum: parseFloat(rating),
                albumId: spotifyId, 
            });

            setSubmitMessage('Rating submitted successfully!');
            setTimeout(() => {
                displayMessage('Rating submitted successfully!');
            }, 0);
        } catch (error) {
            setSubmitMessage('');
            setTimeout(() => {
                displayMessage('Error submitting rating. Please try again.');
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
  

    const getSpotifyAlbumUrl = (spotifyId) => {
        return `https://open.spotify.com/album/${spotifyId}`;
      };
      
    

    return (
        <div className= "album-page">
        <div className="album-details-wrapper">
            <div className="album-details">
                <h1 className="album-title">{title}</h1>
                <img src={albumDetails.coverArtUrl} alt={`${title} cover art`} className="album-cover-art" />
                <div className="album-info">
                    <div className="album-artist">{artist}</div>
                    <div className="album-release-date"> {formattedReleaseDate} </div>
                    <div className="rating-title">Average Rating:</div>
                    <div className="average-rating-display">{averageRating} from {numberOfRatings} rating(s)</div> 
                </div>
            </div>
        </div>

        <div className="album-actions-wrapper">
        <button onClick={() => window.open(getSpotifyAlbumUrl(spotifyId), '_blank')} className="spotify-link-btn">Open in <span className="spotify-green">Spotify</span></button>
    
        <div className="rating-box">
            <div className="rating-title">Your Rating:</div>
            <input
                type="text"
                className={`rating-input ${getRatingClassName(rating)}`}
                value={rating}
                onChange={handleRatingChange}
                onKeyPress={handleRatingSubmit}
                placeholder="-"
            />
            <button
                className="submit-rating-btn"
                onClick={handleRatingSubmit}
            >
                Submit Rating
            </button>
        </div>
        <div className='list-count'>This album appears in {albumListCount} user-created List(s).</div>
          <button onClick={fetchUserLists} className="add-album-btn">Add Album to a List</button>
          <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="album-modal">
            <Modal.Header><Modal.Title>Add {title} by {artist} to one of your lists...</Modal.Title></Modal.Header>
            <Modal.Body>
                {userLists.map(list => (
                    <Button 
                        key={list._id} 
                        onClick={() => addAlbumToList(list._id)} 
                        className="list-select-btn"
                        variant="outline-secondary"
                    >
                        {list.listName}
                    </Button>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        <div key={ratingMessageKey} className={`rating-message ${submitMessage ? 'visible' : ''}`}>
            {submitMessage}
        </div>
        </div>        
    </div>
  );
};
export default AlbumPage;