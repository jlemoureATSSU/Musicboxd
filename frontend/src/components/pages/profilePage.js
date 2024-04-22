import React, { useState, useEffect } from "react";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  const [profileDetails, setProfileDetails] = useState({
    joinDate: null,
    listCount: 0,
    ratingCount: 0
  });
  

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!username) return;

      const userInfo = getUserInfo();
      setLoggedInUser(userInfo ? userInfo.username : null);

      const fetchProfileDetails = async () => {
        try {
          const { data } = await axios.get(`${backendUrl}/user/getProfileDetails/${username}`);
          setProfileDetails({
            joinDate: new Date(data.joinDate).toLocaleDateString(),
            listCount: data.listCount,
            ratingCount: data.ratingCount
          });
        } catch (error) {
          console.error('Error fetching profile details:', error);
        }
      };

      fetchProfileDetails();

      try {
        const userListsResponse = await axios.get(`${backendUrl}/list/getAllListsByUser/${username}`);
        setUserLists(userListsResponse.data);
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }

      try {
        const topRatedResponse = await axios.get(`${backendUrl}/rating/topRatings/${username}`);
        setTopRated(topRatedResponse.data);
      } catch (error) {
        console.error('Error fetching top rated albums:', error);
        setTopRated([]);
      }

      try {
        const userLists = await axios.get(`${backendUrl}/list/getAllListsByUser/${username}`);
        const topRated = await axios.get(`${backendUrl}/rating/topRatings/${username}`);

        const listAlbumIds = userLists.data.flatMap(list =>
          list.albums.slice(0, 3).map(album => album.id)
        );
        const topRatedAlbumIds = topRated.data.map(rating => rating.albumId);
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
        console.error('Error fetching album details:', error);
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
        <div className="user-rating">User's rating: {userRating}</div>
      </div>
    );
  };


  if (!username) return (<div><h4>User profile not found</h4></div>);

  return (
    <div className="profile-page">
        <div className="profile-header">
          <div className="profile-details">
          <div className="profile-username">{username}</div>
          <div className="profile-info"><span className="slash-ten">Joined </span>{profileDetails.joinDate} &middot; {profileDetails.ratingCount} <span className="slash-ten">Ratings</span> &middot; {profileDetails.listCount} <span className="slash-ten">Lists</span></div>
        </div>
      </div>
      <div className='user-highest-rated-albums-container-title'>
        {username}'s Ratings{' '}
        {topRated.length >= 10 && (
          <Link to={`/ratings/${username}`} className='see-more'>see more</Link>
        )}
      </div>
      {topRated.length > 0 ? (
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
      ) : (
        <div className="user-highest-rated-albums-container">
          <p>No Ratings yet</p>
        </div>
      )}

      <div className='recent-lists-container-title'>
        {username}'s Lists{' '}
        {userLists.length >= 7 && (
          <Link to={`/userLists/${username}`} className='see-more'>see more</Link>
        )}
      </div>
      {userLists.length > 0 ? (
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
              likeCount={list.likeCount}
            />
          ))}
        </div>
      ) : (
        <div className="recent-lists-container">
          <p>No Lists created yet</p>
        </div>
      )}

      {loggedInUser === username && (
        <div className="col-md-12 text-center">
          <>
            <div className="logout-btn" onClick={handleShow}>
              Log Out
            </div>
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
