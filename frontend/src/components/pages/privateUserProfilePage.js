import React, { useState, useEffect } from "react";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import ListCard from '../listCard';
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [userLists, setUserLists] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    if (userInfo) {
      fetchUserLists(userInfo.username);
    }
  }, []);

  const fetchUserLists = async (username) => {
    try {
      const response = await axios.get(`${backendUrl}/list/getAllListsByUser/${username}`);
      setUserLists(response.data);

      // Collect album IDs from the first three albums of each list
      const albumIds = response.data.flatMap(list => 
        list.albums.slice(0, 3).map(album => album.id)
      );

      // Ensure unique IDs for the bulk fetch
      fetchAlbumDetails([...new Set(albumIds)]);
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };


const fetchAlbumDetails = async (albumIds) => {
    try {
        const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
            albumIds: albumIds
        });
        const details = detailsResponse.data.reduce((acc, detail) => ({
            ...acc,
            [detail.id]: detail
        }), {});
        setAlbumDetails(details);
    } catch (error) {
        console.error("Error fetching album details in bulk:", error);
    }
};


  

  // handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  if (!user) return (<div><h4>Log in to view this page.</h4></div>);

  return (
    <div className="profile-page">
      <div className="your-lists">
        <div className="your-lists-container-title">{user.username}'s Lists ({userLists.length})</div>
        <div className="your-lists-container">
        {userLists.map(list => (
          <ListCard
            key={list._id}
            userName={list.userName}
            title={list.listName}
            listId={list._id}
            albums={list.albums} 
            dateCreated={list.dateCreated}
            albumDetails={albumDetails} // Pass the album details here
          />
        ))}
      </div>
      </div>
        <div className="col-md-12 text-center">
        <>
              <Button className="me-2" onClick={handleShow}>
                Log Out
              </Button>
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
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
        </div>
);
};

export default PrivateUserProfile;

