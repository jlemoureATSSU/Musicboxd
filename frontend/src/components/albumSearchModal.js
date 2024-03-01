import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const AlbumSearchModal = ({ isOpen, onClose, onSelectAlbum }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
  
    const searchAlbums = debounce(async (search) => {
      if (search) {
          try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/api/searchAlbums?search=${encodeURIComponent(search)}`);
  
              const albums = response.data.albums.map(album => ({
                  id: album.id,
                  name: album.name,
                  artist: album.artists,
                  year: album.release_date ? new Date(album.release_date).getFullYear() : 'Unknown Year',
                  coverArtUrl: album.coverArtUrl
              }));
              setResults(albums);
          } catch (error) {
              console.error('Error fetching search results', error);
              setResults([]);
          }
      } else {
          setResults([]);
      }
  }, 600);
  

    useEffect(() => {
      if (isOpen) {
        setSearchTerm('');
        setResults([]);
      }
    }, [isOpen]);
  
    useEffect(() => {
      searchAlbums(searchTerm);
      return () => {
        searchAlbums.cancel();
      };
    }, [searchTerm]);
  
    if (!isOpen) return null;
  
    const handleSelectAlbum = (selectedAlbum) => {
      const albumDetails = {
        id: selectedAlbum.id,
        name: selectedAlbum.name,
        artist: selectedAlbum.artist,
        releaseDate: selectedAlbum.year,
        coverArtUrl: selectedAlbum.coverArtUrl,
      };
    
      onSelectAlbum(albumDetails);
      onClose();
    };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    background: '#222',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    zIndex: 1001,
  };

  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
  };

  const searchInputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: 'none',
  };

  const searchResultsStyle = {
    background: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const resultItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #484848',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2>Add an album to your <b>List</b></h2>
          <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>
        <input
          type="text"
          placeholder="Search for an album ..."
          style={searchInputStyle}
          value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div style={searchResultsStyle}>
            {results.map((album) => (
                <div 
                    key={album.id} 
                    style={resultItemStyle} 
                    onClick={() => handleSelectAlbum(album)}
                >
                {album.name} by {album.artist} ({album.year})
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumSearchModal;
