import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AlbumCard from '../albumCard'; // Assuming AlbumCard requires coverArtUrl, title, artist, releaseDate, and mbid props
import ListCard from '../listCard';

const HomePage = () => {
    const [recentLists, setRecentLists] = useState([]);
    const [highestRatedAlbums, setHighestRatedAlbums] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({}); // This will store album details keyed by mbid
    const fetchInProgress = useRef(new Set());

    useEffect(() => {
        // Fetch recent lists
        const fetchRecentLists = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/list/getAllLists`);
                setRecentLists(response.data);
            } catch (error) {
                console.error('Error fetching recent lists:', error);
            }
        };

        const fetchHighestRatedAlbums = async () => {
            try {
                const response = await axios.get('http://localhost:8081/rating/getHighestRatedAlbums');
                setHighestRatedAlbums(response.data);
            } catch (error) {
                console.error('Error fetching highest rated albums:', error);
            }
        };

        fetchRecentLists();
        fetchHighestRatedAlbums();
    }, []);

    useEffect(() => {
        highestRatedAlbums.forEach(({ albumId }) => {
          if (albumDetails[albumId] || fetchInProgress.current.has(albumId)) {
            // Details already exist or fetch in progress for this album, skip
            return;
          }
    
          fetchInProgress.current.add(albumId);
    
          const fetchAlbumDetailsAndCoverArt = async (mbid) => {
            try {
              const detailsResponse = await axios.get(`http://localhost:8081/api/getAlbumDetails/${mbid}`);
              const ratingResponse = await axios.get(`http://localhost:8081/rating/getAvgByAlbum/${mbid}`);
              
              setAlbumDetails(prevDetails => ({
                ...prevDetails,
                [mbid]: {
                  ...detailsResponse.data,
                  averageRating: ratingResponse.data.averageRating,
                  numberOfRatings: ratingResponse.data.numberOfRatings
                }
              }));
              
              fetchInProgress.current.delete(mbid);
            } catch (error) {
              console.error("Error fetching details or ratings for album MBID:", mbid, error);
              fetchInProgress.current.delete(mbid);
              // Optionally update an error state here
            }
          };
    
          fetchAlbumDetailsAndCoverArt(albumId);
        });
      }, [highestRatedAlbums]); // This effect depends on the highestRatedAlbums

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
                    />
                ))}
            </div>
            <div className='homepage-container-title'>Highest Rated Albums</div>
            <div className="highest-rated-albums-container">
            {highestRatedAlbums.map(({ albumId }) => {
                    const album = albumDetails[albumId];
                    if (!album?.details) return null; // Only render AlbumCards with fetched details

                    const title = album.details.title || 'Unknown Title';
                    const artist = album.details['artist-credit']?.map(ac => ac.name).join(', ') || 'Unknown Artist';
                    const releaseDate = album.details['first-release-date'] || 'Unknown Release Date';
                    const formattedReleaseDate = releaseDate !== 'Unknown Date' ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric'}) : 'Unknown Date';

                    return (
                        <AlbumCard
                            key={albumId}
                            coverArtUrl={album.coverArtUrl}
                            title={title}
                            artist={artist}
                            releaseDate={formattedReleaseDate}
                            mbid={albumId}
                            averageRating={album.averageRating}
                            numberOfRatings={album.numberOfRatings}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default HomePage;
