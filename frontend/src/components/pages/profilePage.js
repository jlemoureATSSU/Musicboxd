import React, { useState, useEffect } from "react";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";
import ListCard from '../listCard';
import getUserInfo from "../../utilities/decodeJwt";
import AlbumCard from '../albumCard';

const UserProfile = () => {
  const [show, setShow] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { username } = useParams();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!username) return;

      const userInfo = getUserInfo();
      setLoggedInUser(userInfo ? userInfo.username : null);

      try {
        const userListsResponse = axios.get(`${backendUrl}/list/getAllListsByUser/${username}`);
        const topRatedResponse = axios.get(`${backendUrl}/rating/topRatings/${username}`);

        const [userListsResult, topRatedResult] = await Promise.all([userListsResponse, topRatedResponse]);

        setUserLists(userListsResult.data);
        setTopRated(topRatedResult.data);

        // Combine album IDs from user lists and top rated albums
        const listAlbumIds = userListsResult.data.flatMap(list =>
          list.albums.slice(0, 3).map(album => album.id)
        );
        const topRatedAlbumIds = topRatedResult.data.map(rating => rating.albumId);

        const allAlbumIds = [...new Set([...listAlbumIds, ...topRatedAlbumIds])];

        if (allAlbumIds.length > 0) {
          const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
            albumIds: allAlbumIds
          });
          const details = detailsResponse.data.reduce((acc, detail) => ({
            ...acc,
            [detail.id]: detail
          }), {});
          setAlbumDetails(details);
        }
      } catch (error) {
        console.error('Error fetching initial data for user profile:', error);
      }
    };

    fetchInitialData();
  }, [username, backendUrl]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const UserRatedAlbumCard = ({ userRating, ...albumCardProps }) => {
    return (
      <div className="user-rated-album-card">
        <AlbumCard {...albumCardProps} />
        <div className="user-rating">Rating: {userRating}</div>
      </div>
    );
  };


  if (!username) return (<div><h4>User profile not found.</h4></div>);

  return (
    <div className="profile-page">

      <div className='user-highest-rated-albums-container-title'>{username}'s Highest Rated </div>
      <div className="user-highest-rated-albums-container">
        {topRated.map(({ albumId }) => {
          const album = albumDetails[albumId];
          if (!album) return null;
          const releaseDate = new Date(album.release_date).getFullYear();
          return (
            <UserRatedAlbumCard
              key={album.id}
              coverArtUrl={album.coverArtUrl}
              title={album.name}
              artist={album.artists}
              artistIds={album.artistIds}
              releaseDate={releaseDate}
              spotifyId={album.id}
              averageRating={album.averageRating}
              numberOfRatings={album.numberOfRatings}
              type={album.type}
              isClickable={true}
              userRating={topRated.find(rating => rating.albumId === album.id).ratingNum}
            />
          );
        })}
      </div>

      <div className='recent-lists-container-title'>{username}'s Lists</div>
      <div className="recent-lists-container">
        {userLists.map(list => (
          <ListCard
            key={list._id}
            userName={list.userName}
            title={list.listName}
            listId={list._id}
            albums={list.albums}
            dateCreated={list.dateCreated}
            albumDetails={albumDetails}
          />
        ))}
      </div>
      {loggedInUser === username && (
        <div className="col-md-12 text-center">
          <>
            <Button className="me-2" onClick={handleShow}>
              Log Out
            </Button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
