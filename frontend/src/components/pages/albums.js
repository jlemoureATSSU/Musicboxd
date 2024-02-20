import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';

const Albums = () => {
    const [albums, setAlbums] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({});
    const fetchInProgress = useRef(new Set());
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sortingMode, setSortingMode] = useState('highestRated');


    const fetchAlbums = async (nextPage, mode) => {
        const limit = 10;
        const offset = nextPage * limit;
        let url = mode === 'highestRated' 
                  ? `http://localhost:8081/rating/getHighestRatedAlbums?limit=${limit}&offset=${offset}`
                  : `http://localhost:8081/api/getNewestAlbums?limit=${limit}&offset=${offset}`;

        try {
            const response = await axios.get(url);
            if (response.data.length > 0) {
                setAlbums(prevAlbums => [...prevAlbums, ...response.data]);
                if (response.data.length < limit) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(`Error fetching albums for mode ${mode}`, error);
            setHasMore(false);
        }
    };
    

    useEffect(() => {
        fetchAlbums(page, sortingMode);
    }, [page, sortingMode]);

    useEffect(() => {
        albums.forEach(({ albumId }) => {
          if (albumDetails[albumId] || fetchInProgress.current.has(albumId)) {
            return;
          }
    
          fetchInProgress.current.add(albumId);
    
          const fetchAlbumDetails = async (spotifyId) => {
            try {
              const detailsResponse = await axios.get(`http://localhost:8081/api/getAlbumDetails/${spotifyId}`);
              
              setAlbumDetails(prevDetails => ({
                ...prevDetails,
                [spotifyId]: {
                  ...detailsResponse.data,
                }
              }));
              
              fetchInProgress.current.delete(spotifyId);
            } catch (error) {
              console.error("Error fetching details for album spotifyId:", spotifyId, error);
              fetchInProgress.current.delete(spotifyId);
            }
          };
    
          fetchAlbumDetails(albumId);
        });
      }, [albums]);

    const handleSeeMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleChangeSortingMode = (newMode) => {
        if (newMode !== sortingMode) {
            setSortingMode(newMode);
            setAlbums([]);
            setPage(0);
            setHasMore(true);
        }
    };

    return (
        <div>
            <div className="sorting-buttons">
                <button 
                    className={`sort-button ${sortingMode === 'highestRated' ? 'active' : ''}`} 
                    onClick={() => handleChangeSortingMode('highestRated')}
                >
                    Highest Rated
                </button>
                <button 
                    className={`sort-button ${sortingMode === 'newest' ? 'active' : ''}`} 
                    onClick={() => handleChangeSortingMode('newest')}
                >
                    Newest
                </button>
            </div>
            <div className="albums-container">
                {albums.map(({ albumId }) => {
                    const album = albumDetails[albumId];
                    if (!album) return null;
                    return (
                        <AlbumCard
                            key={albumId}
                            coverArtUrl={album.coverArtUrl}
                            title={album.name}
                            artist={album.artists}
                            artistIds={album.artistIds}
                            releaseDate={new Date(album.release_date).toLocaleDateString('en-US', { year: 'numeric'})}
                            spotifyId={albumId}
                            averageRating={album.averageRating}
                            numberOfRatings={album.numberOfRatings}
                            isClickable={true}
                        />
                    );
                })}
                {hasMore && (
                    <div class = "see-more-btn-container">
                    <button onClick={handleSeeMore} className="see-more-btn">
                        see more
                    </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Albums;
