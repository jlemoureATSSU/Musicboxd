import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import getUserInfo from "../../utilities/decodeJwt";


const AlbumPage = () => {
    const [albumDetails, setAlbumDetails] = useState(null);
    const [coverArtUrl, setCoverArtUrl] = useState('');
    const [userLists, setUserLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [albumListCount, setAlbumListCount] = useState(0);
    const { mbid } = useParams();
    const user = getUserInfo();

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const detailsResponse = await axios.get(`https://musicbrainz.org/ws/2/release-group/${mbid}?fmt=json&inc=artist-credits+releases`, {
                    headers: {
                        'User-Agent': 'Musicboxd (joelem316@gmail.com)'
                    }
                });
                setAlbumDetails(detailsResponse.data);

                // Fetch cover art
                const coverResponse = await axios.get(`http://coverartarchive.org/release-group/${mbid}`, {
                    headers: {
                        'User-Agent': 'Musicboxd (joelem316@gmail.com)'
                    }
                });
                if (coverResponse.data.images && coverResponse.data.images.length > 0) {
                    setCoverArtUrl(coverResponse.data.images[0].image);
                }
            } catch (error) {
                console.error("Error fetching album details", error);
            }
        };

        const fetchAlbumListCount = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/list/albumInListsCount/${mbid}`);
                setAlbumListCount(response.data.count);
            } catch (error) {
                console.error("Error fetching album list count", error);
            }
        };

        fetchAlbumDetails();
        fetchAlbumListCount();
    }, [mbid]);

    const fetchUserLists = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/list/getAllListsByUser/${user.username}`);
            setUserLists(response.data);
            setShowModal(true); // Show the modal with the list options
        } catch (error) {
            console.error("Error fetching user's lists", error);
        }
    };

    const addAlbumToList = async (listId) => {
        const albumMBID = mbid;  // The MBID of the album
    
        try {
          await axios.post(`http://localhost:8081/list/addAlbumToList/${listId}`, { albumMBID });
          setShowModal(false); // Close the modal after adding
          setAlbumListCount(albumListCount + 1);
        } catch (error) {
          console.error('Error adding album to list:', error);
          // Handle errors, such as showing an error notification
        }
      };
      

    if (!albumDetails) {
        return <div>Loading...</div>;
    }

    const artist = albumDetails['artist-credit']?.map(ac => ac.name).join(', ') ?? 'Unknown Artist';
    const title = albumDetails.title || 'Unknown Title';
    const releaseDate = albumDetails['first-release-date'] || 'Unknown Release Date';

    return (
        <div className= "album-page">
            <AlbumCard
              coverArtUrl={coverArtUrl}
              title={title}
              artist={artist}
              releaseDate={releaseDate !== 'Unknown Date' ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date'}
              mbid={mbid}
            />
        <div>
            This album appears in {albumListCount} user-created List(s).
        </div>
          <button onClick={fetchUserLists} className="add-album-btn">Add Album to a List</button>
          <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="album-modal">
            <Modal.Header>
                <Modal.Title>Add {title} by {artist} to one of your lists...</Modal.Title>
            </Modal.Header>
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
    </div>
  );
};
export default AlbumPage;