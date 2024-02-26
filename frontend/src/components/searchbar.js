import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchMode, setSearchMode] = useState('artist');

    const search = debounce(async (search) => {
      if (!search) {
        setResults([]);
        return;
      }
    
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const searchUrl = searchMode === 'artist' 
        ? `${backendUrl}/api/searchArtists?search=${encodeURIComponent(search)}` 
        : `${backendUrl}/api/searchAlbums?search=${encodeURIComponent(search)}`;
    
        try {
          const response = await axios.get(searchUrl);
          console.log(response.data); 
        
          let results = [];
          if (searchMode === 'artist' && response.data && Array.isArray(response.data.artists)) {
            results = response.data.artists.map(artist => ({
              id: artist.id,
              name: artist.name,
              type: 'artist'
            }));
          } else if (searchMode === 'album' && response.data && Array.isArray(response.data.albums)) {
            results = response.data.albums.map(album => {
              const year = album.release_date ? new Date(album.release_date).getFullYear() : 'Unknown Year';
              return {
                id: album.id,
                name: album.name,
                artist: album.artists,
                year,
                type: 'album'
              };
            });
          } else {
            console.error('The API response does not have the expected structure.');
          }
          
          setResults(results);
        } catch (error) {
          console.error('Error fetching search results', error);
          setResults([]);
        }
    }, 600);
    
    
    
    
    useEffect(() => {
        search(searchTerm);

        return () => {
            search.cancel();
        };
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (!event.target.closest('.search-bar') && !event.target.closest('.search-results')) {
            setResults([]);
          }
        };
      
        document.addEventListener('mousedown', handleClickOutside);
      
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const handleArtistSelect = (artist) => {
        setResults([]);
        navigate(`/artistPage/${artist.id}`); 
    };

    const handleAlbumSelect = (album) => {
      setResults([]);
        navigate(`/albumPage/${album.id}`);
      };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && highlightedIndex < results.length - 1) {
          setHighlightedIndex(prevIndex => prevIndex + 1);
        } else if (e.key === 'ArrowUp' && highlightedIndex > 0) {
          setHighlightedIndex(prevIndex => prevIndex - 1);
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          handleArtistSelect(results[highlightedIndex].id);
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          const result = results[highlightedIndex];
          if (result.type === 'album') {
            handleAlbumSelect(result);
          } else {
            handleArtistSelect(result.id);
          }
        }
        
      };
      

      return (
        <div className="search-bar">
            <input
            type="text"
            placeholder={`Search for an ${searchMode}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            />
          <div className="search-controls">
          <button
              className={`search-mode-button ${searchMode === 'artist' ? 'active' : ''}`}
              onClick={() => {
                setSearchMode('artist');
                setSearchTerm('');
                setResults([]);
              }}
            >
              Artists
            </button>
            <button
              className={`search-mode-button ${searchMode === 'album' ? 'active' : ''}`}
              onClick={() => {
                setSearchMode('album');
                setSearchTerm(''); 
                setResults([]);
              }}
            >
              Albums
            </button>
          </div>
          <div className='search-results'>
            {results.map((result, index) => (
              <div
                key={index}
                className={`search-result ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => result.type === 'album' ? handleAlbumSelect(result) : handleArtistSelect(result)}
                onMouseOver={() => setHighlightedIndex(index)}
              >
                {result.type === 'album' && (
                  <>
                    <span className="result-type">Album</span> 
                    {result.name} <span className="album-artist">{result.artist}</span> <span className="album-year">({result.year})</span>
                  </>
                )}
                {result.type === 'artist' && (
                  <>
                    <span className="result-type">Artist</span> 
                    {result.name}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
      
};

export default SearchBar;
