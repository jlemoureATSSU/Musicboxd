import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';
import ListCard from '../listCard';

const HomePage = () => {
    const [recentLists, setRecentLists] = useState([]);
    const [highestRatedAlbums, setHighestRatedAlbums] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({});
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
      const fetchInitialData = async () => {
        try {
          // Fetch highest rated albums and recent lists
          const [highestRatedResponse, recentListsResponse] = await Promise.all([
            axios.get(`${backendUrl}/rating/getHighestRatedAlbums`),
            axios.get(`${backendUrl}/list/getRecentLists`)
          ]);
          
          setHighestRatedAlbums(highestRatedResponse.data);
          setRecentLists(recentListsResponse.data);
    
          // Collect all unique album IDs from highestRatedAlbums
          const highestRatedAlbumIds = highestRatedResponse.data.map(album => album.albumId);
    
          // Collect all unique album IDs from recentLists
          const listAlbumIds = recentListsResponse.data.flatMap(list => 
            list.albums.slice(0, 3).map(album => album.id) // Only take first 3 albums per list
          );    
          // Combine and deduplicate album IDs
          const uniqueAlbumIds = Array.from(new Set([...highestRatedAlbumIds, ...listAlbumIds]));
    
          // Fetch details for all unique albums
          const albumDetailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
            albumIds: uniqueAlbumIds
          });
    
          // Update state with album details
          setAlbumDetails(albumDetailsResponse.data.reduce((acc, detail) => {
            acc[detail.id] = detail;
            return acc;
          }, {}));
        } catch (error) {
          console.error("Error fetching initial data:", error);
        }
      };
    
      fetchInitialData();
    }, []);
    

    return (
        <div>
            <div className='homepage-container-title'>Recently Created Lists</div>
            <div className="recent-lists-container">
                {recentLists.map(list => (
                  <ListCard
                      key={list._id}
                      userName={list.userName}
                      title={list.listName}
                      listId={list._id}
                      albums={list.albums}
                      dateCreated={list.dateCreated}
                      albumDetails={albumDetails} // Pass the album details here
                    />
                ))}
            </div>
            <div className='homepage-container-title'>Highest Rated Albums <Link to="/albums" className='see-more' state={{ sortingMode: 'highestRated' }}>see more</Link></div>
            <div className="highest-rated-albums-container">
                {highestRatedAlbums.map(({ albumId }) => { 
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
            </div>
        </div>
    );
};

export default HomePage;
