import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AlbumCard from '../albumCard';
import ListCard from '../listCard';

const HomePage = () => {
    const [recentLists, setRecentLists] = useState([]);
    const [highestRatedAlbums, setHighestRatedAlbums] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({});
    const fetchInProgress = useRef(new Set());

    useEffect(() => {

        const fetchHighestRatedAlbums = async () => {
          try {
              const response = await axios.get('http://localhost:8081/rating/getHighestRatedAlbums');
              setHighestRatedAlbums(response.data);
          } catch (error) {
              console.error('Error fetching highest rated albums:', error);
          }
        };
        const fetchRecentLists = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/list/getRecentLists`);
                setRecentLists(response.data);
            } catch (error) {
                console.error('Error fetching recent lists:', error);
            }
        };

        fetchRecentLists();
        fetchHighestRatedAlbums();
    }, []);

    useEffect(() => {
        highestRatedAlbums.forEach(({ albumId }) => {
          if (albumDetails[albumId] || fetchInProgress.current.has(albumId)) {
            return;
          }
    
          fetchInProgress.current.add(albumId);
    
          const fetchAlbumDetails = async (spotifyId) => {
            try {
              const detailsResponse = await axios.get(`http://localhost:8081/api/getAlbumDetails/${spotifyId}`);
              const ratingResponse = await axios.get(`http://localhost:8081/rating/getAvgByAlbum/${spotifyId}`);
              
              setAlbumDetails(prevDetails => ({
                ...prevDetails,
                [spotifyId]: {
                  ...detailsResponse.data,
                  averageRating: ratingResponse.data.averageRating,
                  numberOfRatings: ratingResponse.data.numberOfRatings
                }
              }));
              
              fetchInProgress.current.delete(spotifyId);
            } catch (error) {
              console.error("Error fetching details or ratings for album spotifyId:", spotifyId, error);
              fetchInProgress.current.delete(spotifyId);
            }
          };
    
          fetchAlbumDetails(albumId);
        });
      }, [highestRatedAlbums]);

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
                    />
                ))}
            </div>
            <div className='homepage-container-title'>Highest Rated Albums</div>
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
                    releaseDate={new Date(album.release_date).toLocaleDateString('en-US', { year: 'numeric'})}
                    spotifyId={albumId} 
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
