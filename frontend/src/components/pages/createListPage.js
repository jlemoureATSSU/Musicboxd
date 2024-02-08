import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlbumSearchModal from '../albumSearchModal';
import AlbumCard from '../albumCard';
import getUserInfo from "../../utilities/decodeJwt"

const url = "http://localhost:8081/list/create";

const CreateListPage = () => {
  const [user, setUser] = useState({})
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [albums, setAlbums] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleTitleChange = (e) => setListTitle(e.target.value);
  const handleDescriptionChange = (e) => setListDescription(e.target.value);
  
  useEffect(() => {
    const setUserInfo = async () => {
      const info = await getUserInfo();
      setUser(info);
    };
    
    setUserInfo();
  }, []);
  

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
      albums: albums.map((album) => ({ id: album.id }))
    };

    try {
      const response = await axios.post(url, listData);
      console.log('List saved:', response.data);
      const newListId = response.data._id; 
      navigate(`/listPage/${newListId}`);
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
            key={album.id}
            coverArtUrl={album.coverArtUrl}
            title={album.name}
            artist={album.artist}
            releaseDate={album.releaseDate}
            mbid={album.id}
            />
          ))}
          <div className="add-album-plus" onClick={() => setIsModalOpen(true)}>+</div>
        </div>
      </div>
      <AlbumSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectAlbum={addAlbumToList}
      />
    </div>
  );
}

export default CreateListPage;
