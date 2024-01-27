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


    const searchMusicBrainz = debounce(async (search) => {
        if (search) {
          try {
            let results = [];
            if (searchMode === 'artist') {
              const response = await axios.get(`https://musicbrainz.org/ws/2/artist/?query=${search}&fmt=json`, {
                headers: { 'User-Agent': 'MusicBoxd/1.0 (joelem316@gmail.com)' }
              });
              results = response.data.artists.slice(0, 7).map(artist => ({
                id: artist.id,
                name: artist.name,
                type: 'artist'
              }));
            } else if (searchMode === 'album') {
              const response = await axios.get(`https://musicbrainz.org/ws/2/release-group/?query=${search}&fmt=json`, {
                headers: { 'User-Agent': 'MusicBoxd/1.0 (joelem316@gmail.com)' }
              });
              results = response.data['release-groups'].slice(0, 7).map(album => ({
                id: album.id,
                name: album.title,
                artist: album['artist-credit'] ? album['artist-credit'][0].name : 'Unknown Artist',
                year: album['first-release-date'] ? new Date(album['first-release-date']).getFullYear() : 'Unknown Year',
                type: 'album'
              }));
            }
            setResults(results);
          } catch (error) {
            console.error('Error fetching search results', error);
            setResults([]);
          }
        } else {
          setResults([]);
        }
      }, 300);
      
      

    useEffect(() => {
        searchMusicBrainz(searchTerm);

        return () => {
            searchMusicBrainz.cancel();
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

    const handleArtistSelect = (mbid) => {
        setResults([]);
        navigate(`/artistPage/${mbid}`);
    };

    const handleAlbumSelect = (mbid) => {
        setResults([]);
        navigate(`/albumPage/${mbid}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && highlightedIndex < results.length - 1) {
          setHighlightedIndex(prevIndex => prevIndex + 1);
        } else if (e.key === 'ArrowUp' && highlightedIndex > 0) {
          setHighlightedIndex(prevIndex => prevIndex - 1);
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          handleArtistSelect(results[highlightedIndex].id);
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
            onClick={() => setSearchMode('artist')}
            >
            Artists
            </button>
            <button
            className={`search-mode-button ${searchMode === 'album' ? 'active' : ''}`}
            onClick={() => setSearchMode('album')}
            >
            Albums
            </button>
          </div>
          <div className='search-results'>
            {results.map((result, index) => (
                <div
                    key={index}
                    className={`search-result ${index === highlightedIndex ? 'highlighted' : ''}`}
                    onClick={() => result.type === 'artist' ? handleArtistSelect(result.id) : handleAlbumSelect(result.id)}
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
