import React, { useState, useEffect, useRef } from 'react';
import { Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';

const Albums = () => {
    const location = useLocation();
    const sortingModeFromLink = location.state?.sortingMode;
    const [albums, setAlbums] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({});
    const fetchInProgress = useRef(new Set());
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sortingMode, setSortingMode] = useState(sortingModeFromLink || 'highestRated');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    const fetchAlbums = async (nextPage, mode) => {
        const limit = 12;
        const offset = nextPage * limit;
        let url = mode === 'highestRated' 
                  ? `${backendUrl}/rating/getHighestRatedAlbums?limit=${limit}&offset=${offset}`
                  : `${backendUrl}/api/getNewestAlbums?limit=${limit}&offset=${offset}`;
    
        try {
            const response = await axios.get(url);
            if (response.data.length > 0) {
                const newAlbums = response.data;
                setAlbums(prevAlbums => [...prevAlbums, ...newAlbums]);
                const newAlbumIds = newAlbums.map(album => album.albumId);
                fetchAlbumDetails(newAlbumIds); // Fetch new album details only
                setHasMore(newAlbums.length === limit);
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

const fetchAlbumDetails = async (albumIds) => {
    try {
        const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
            albumIds: albumIds
        });
        const newDetails = detailsResponse.data;
        setAlbumDetails(prevDetails => {
            const updatedDetails = { ...prevDetails };
            newDetails.forEach(album => {
                updatedDetails[album.id] = album;
            });
            return updatedDetails;
        });
    } catch (error) {
        console.error("Error fetching album details in bulk:", error);
    }
};

    


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
        <div className='albums-page'>
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
            <div className="all-albums-container">
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
                            releaseDate={new Date(album.release_date).getFullYear()}                           
                            spotifyId={albumId}
                            averageRating={album.averageRating}
                            numberOfRatings={album.numberOfRatings}
                            type={album.type}
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
