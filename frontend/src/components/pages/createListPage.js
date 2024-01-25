//react page that allows users to add songs to a numbered list.
import React, { useState } from 'react';
import axios from 'axios';
import AlbumSearchModal from '../albumSearchModal';
import AlbumCard from '../albumCard';

const url = "http://localhost:8081/list/create";

const CreateListPage = () => {
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [albums, setAlbums] = useState([]); // This will hold the albums added to the list
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTitleChange = (e) => setListTitle(e.target.value);
  const handleDescriptionChange = (e) => setListDescription(e.target.value);
  
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
        headers: { 'User-Agent': 'YourAppName/1.0 (youremail@example.com)' }
      });
      const album = response.data;
      return {
        id: albumId,
        name: album.title,
        artist: album['artist-credit'] ? album['artist-credit'][0].name : 'Unknown Artist',
        year: album['first-release-date'] ? new Date(album['first-release-date']).getFullYear() : 'Unknown Year',
      };
    } catch (error) {
      console.error("Error fetching album details", error);
      return { id: albumId, name: '', artist: '', year: '' };
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
      listName: listTitle,
      listDescription: listDescription,
      albums: albums.map((album) => ({ id: album.id })) // Include only the MBIDs
    };

    try {
      const response = await axios.post(url, listData);
      // Handle success here
      console.log('List saved:', response.data);
      // Redirect to the list page or clear the form, etc.
    } catch (error) {
      // Handle error here
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
