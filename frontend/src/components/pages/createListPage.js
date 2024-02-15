import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AlbumSearchModal from '../albumSearchModal';
import AlbumCard from '../albumCardInList';
import getUserInfo from "../../utilities/decodeJwt"

const url = "http://localhost:8081/list/save";

const CreateListPage = () => {
  const [user, setUser] = useState({})
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [albums, setAlbums] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { listId } = useParams();
  const handleTitleChange = (e) => setListTitle(e.target.value);
  const handleDescriptionChange = (e) => setListDescription(e.target.value);
  
  useEffect(() => {
    const fetchListDetails = async () => {
      if (listId) { // Check if listId exists
        try {
          const listResponse = await axios.get(`http://localhost:8081/list/getListById/${listId}`);
          const { listName, listDescription, albums } = listResponse.data;
          
          // Pre-populate the form with fetched data
          setListTitle(listName);
          setListDescription(listDescription);
          
          // Fetch detailed album information for each album
          const albumDetailsResponses = await Promise.all(
            albums.map((album) =>
              axios.get(`http://localhost:8081/api/getAlbumDetails/${album.id}`)
            )
          );
          // Extract the data from each response and set it to the albums state
          const detailedAlbums = albumDetailsResponses.map(response => {
            return {
              id: response.data.id,
              coverArtUrl: response.data.coverArtUrl,
              name: response.data.name,
              artist: response.data.artists, // Make sure this matches the backend structure
              releaseDate: new Date(response.data.release_date).getFullYear() // Adjust this according to the data structure
            };
          });
          setAlbums(detailedAlbums);
  
        } catch (error) {
          console.error('Error fetching list details:', error);
        }
      }
  
      const setUserInfo = async () => {
        const info = await getUserInfo();
        setUser(info);
      };
      
      setUserInfo();
    };
  
    fetchListDetails();
  }, [listId]);
  

  const addAlbumToList = (albumDetails) => {
    if (albums.some((a) => a.id === albumDetails.id)) {
      alert("This album is already added to the list.");
      return;
    }
    

    setAlbums(prevAlbums => [
      ...prevAlbums,
      albumDetails 
    ]);

    setIsModalOpen(false);
  };

  

  const handleSaveList = async () => {
    const listData = {
      userName: user.username,
      listName: listTitle,
      listDescription: listDescription,
      albums: albums.map((album) => ({ id: album.id })),
    };
  
    // Include the listId as _id in the request if it exists
    if (listId) {
      listData._id = listId;
    }
  
    try {
      const response = await axios.post(url, listData);
      console.log('List saved:', response.data);
      // Use the existing listId if editing, or the new one if creating
      const savedListId = response.data._id;
      navigate(`/listPage/${savedListId}`);
    } catch (error) {
      console.error('Error saving the list:', error);
    }
  };
  

  const handleDiscardList = () => {
    setListTitle('');
    setListDescription('');
    setAlbums([]);
  };

  return (
    <div className="create-list-page">
      <div className="list-input-card">
        <input 
          type="text" 
          placeholder="List Title" 
          value={listTitle}
          onChange={handleTitleChange}
          className="list-title-input"
        />
        <textarea 
          placeholder="List Description" 
          value={listDescription}
          onChange={handleDescriptionChange}
          className="list-description-input"
        />
        <div className="list-actions">
          <button onClick={handleDiscardList} className="discard-btn">Discard</button>
          <button onClick={handleSaveList} className="save-btn">Save List</button>
        </div>
      </div>
      <div className="album-list-card">
        <div className="album-list">
          {albums.map((album) => (
            <AlbumCard 
            coverArtUrl={album.coverArtUrl}
            title={album.name}
            artist={album.artist}
            releaseDate={album.releaseDate}
            spotifyId={album.id}
            />
          ))}
        </div>
      </div>
      <div className="add-album-plus" onClick={() => setIsModalOpen(true)}>+</div>
      <AlbumSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectAlbum={addAlbumToList}
      />
    </div>
  );
}

export default CreateListPage;
