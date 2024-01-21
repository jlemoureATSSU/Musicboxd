//react page that allows users to add songs to a numbered list.
import React, { useState } from 'react';
import AlbumSearchModal from '../albumSearchModal';
import AlbumInListCard from '../albumInListCard';

const CreateListPage = () => {
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [albums, setAlbums] = useState([]); // This will hold the albums added to the list
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTitleChange = (e) => {
    setListTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setListDescription(e.target.value);
  };

  const handleSaveList = () => {
    // Logic to save the list
    console.log('List saved:', { listTitle, listDescription, albums });
    // Reset state
    setListTitle('');
    setListDescription('');
    setAlbums([]);
  };

  const handleDiscardList = () => {
    // Reset state
    setListTitle('');
    setListDescription('');
    setAlbums([]);
  };

  const handleAddAlbum = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addAlbumToList = (album) => {
    setAlbums((prevAlbums) => {
      // Add the album if it is not already in the list
      if (!prevAlbums.some((a) => a.id === album.id)) {
        return [...prevAlbums, album];
      }
      return prevAlbums;
    });
    setIsModalOpen(false); // Close the modal after adding the album
  };

  return (
    <div className="main">
      <div className="list-form">
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
        <div className="album-list-container">
          {albums.map((album, index) => (
            <AlbumInListCard key={album.id} album={album} index={index} />
          ))}
          <div className="add-album-btn" onClick={handleAddAlbum}>+</div>
        </div>
        <div className="list-actions">
          <button onClick={handleDiscardList} className="discard-btn">Discard</button>
          <button onClick={handleSaveList} className="save-btn">Save List</button>
        </div>
      </div>
      <AlbumSearchModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSelectAlbum={addAlbumToList}
      />
    </div>
  );
}

export default CreateListPage;
