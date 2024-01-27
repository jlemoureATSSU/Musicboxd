//react page that allows users to add songs to a numbered list.
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
  const [albums, setAlbums] = useState([]); // This will hold the albums added to the list
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
  

  const fetchCoverArt = async (albumMBID) => {
    try {
      const coverResponse = await axios.get(`http://coverartarchive.org/release-group/${albumMBID}`);
      return coverResponse.data.images[0].image; // Return the URL of the first image
    } catch (error) {
      console.error("Error fetching cover art", error);
      return ''; // Return empty string if no cover art is found
    }
  };

  const fetchAlbumDetails = async (albumId) => {
    try {
      const response = await axios.get(`https://musicbrainz.org/ws/2/release-group/${albumId}?inc=artist-credits&fmt=json`, {
        headers: { 'User-Agent': 'Musicboxd (joelem316@gmail.com)' }
      });
      const album = response.data;
      return {
        id: albumId,
        title: album.title,
        artist: album['artist-credit'] ? album['artist-credit'][0].name : 'Unknown Artist',
        year: album['first-release-date'] ? new Date(album['first-release-date']).getFullYear() : 'Unknown Year',
      };
    } catch (error) {
      console.error("Error fetching album details", error);
      return { id: albumId, title: '', artist: '', year: '' };
    }
  };

  const addAlbumToList = async (albumId) => {
    if (albums.some((a) => a.id === albumId)) {
      alert("This album is already added to the list.");
      return;
    }
    
    const albumDetails = await fetchAlbumDetails(albumId);
    const coverArtUrl = await fetchCoverArt(albumId);

    setAlbums(prevAlbums => [
      ...prevAlbums,
      { ...albumDetails, coverArtUrl }
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
      const newListId = response.data._id; // Get the ID of the new list from the response
      navigate(`/listPage/${newListId}`);
    } catch (error) {
      console.error('Error saving the list:', error);
    }
  };

  const handleDiscardList = () => {
    // Reset state
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
            title={album.title}
            artist={album.artist}
            releaseDate={album.year}
            mbid={album.id}
            />
          ))}
          <div className="add-album-btn" onClick={() => setIsModalOpen(true)}>+</div>
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
