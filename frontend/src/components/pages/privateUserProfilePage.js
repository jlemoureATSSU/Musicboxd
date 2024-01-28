import React, { useState, useEffect } from "react";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import ListCard from '../listCard'; // Ensure this path is correct
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [userLists, setUserLists] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    if (userInfo) {
      fetchUserLists(userInfo.username); // Assuming the username is in the decoded token
    }
  }, []);

  const fetchUserLists = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8081/list/getAllListsByUser/${username}`);
      console.log(response.data);
      setUserLists(response.data);
    } catch (error) {
      console.error('Error fetching user lists:', error);
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
    <div className="main">
      <div className="col-md-12 text-center">
        <h1>{user.username}</h1>
      </div>
      <div className="container">
        <h2 className="text-center">Your Lists</h2>
        <div className="user-lists">
          {userLists.map(list => (
            <ListCard userName={username} title={list.listName} listId={list._id} />
          ))}
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
        </div>
);
};

export default PrivateUserProfile;

