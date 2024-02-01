import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const AlbumSearchModal = ({ isOpen, onClose, onSelectAlbum }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
  
    const searchMusicBrainz = debounce(async (search) => {
      if (search) {
        try {
          const response = await axios.get(`https://musicbrainz.org/ws/2/release-group/?query=${search}&fmt=json&limit=7&type=album`, {
            headers: { 'User-Agent': 'MusicBoxd (joelem316@gmail.com)' }
          });
      
          const albums = response.data['release-groups'].map(album => ({
            id: album.id,
            name: album.title,
            artist: album['artist-credit'] ? album['artist-credit'][0].name : 'Unknown Artist',
            year: album['first-release-date'] ? new Date(album['first-release-date']).getFullYear() : 'Unknown Year',
          }));
          setResults(albums);
        } catch (error) {
          console.error('Error fetching search results', error);
          setResults([]);
        }
      } else {
        setResults([]);
      }      
      
    }, 300);

    useEffect(() => {
      // Clear the search term whenever the modal is opened
      if (isOpen) {
        setSearchTerm('');
        setResults([]);
      }
    }, [isOpen]);
  
    useEffect(() => {
      searchMusicBrainz(searchTerm);
      // Cleanup the debounce
      return () => {
        searchMusicBrainz.cancel();
      };
    }, [searchTerm]);
  
    if (!isOpen) return null;
  
    const handleSelectAlbum = (album) => {
      onSelectAlbum(album.id);
      onClose(); // Close the modal
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
    background: '#2c2c2c',
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
    background: '#3c3c3c',
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
          <h2>Add an album to your list</h2>
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
