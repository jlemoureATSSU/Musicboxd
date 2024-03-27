import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AlbumCard from '../albumCard';
import ListCard from '../listCard';

const HomePage = () => {
  const [recentLists, setRecentLists] = useState([]);
  const [highestRatedAlbums, setHighestRatedAlbums] = useState([]);
  const [newestReleases, setNewestReleases] = useState([]);

  const [albumDetails, setAlbumDetails] = useState({});
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [highestRatedResponse, newestReleasesResponse, recentListsResponse] = await Promise.all([
          axios.get(`${backendUrl}/rating/getHighestRatedAlbums`),
          axios.get(`${backendUrl}/api/getNewestAlbums`),
          axios.get(`${backendUrl}/list/getRecentLists`)
        ]);

        setHighestRatedAlbums(highestRatedResponse.data);
        setNewestReleases(newestReleasesResponse.data);
        setRecentLists(recentListsResponse.data);

        const highestRatedAlbumIds = highestRatedResponse.data.map(album => album.albumId);
        const newestReleaseAlbumIds = newestReleasesResponse.data.map(album => album.albumId);

        const listAlbumIds = recentListsResponse.data.flatMap(list =>
          list.albums.slice(0, 3).map(album => album.id)
        );
        const uniqueAlbumIds = Array.from(new Set([...highestRatedAlbumIds, ...newestReleaseAlbumIds, ...listAlbumIds]));

        const albumDetailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
          albumIds: uniqueAlbumIds
        });

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
    <div className='home-page'>
      <div className='highest-rated-albums-container-title'>Highest Rated Albums <Link to="/albums" className='see-more' state={{ sortingMode: 'highestRated' }}>see more</Link></div>
      <div className="highest-rated-albums-container">
        {highestRatedAlbums.map(({ albumId }) => {
          const album = albumDetails[albumId];
          if (!album) return null;
          const releaseDate = new Date(album.release_date).getFullYear();

          return (
            <AlbumCard
              key={albumId}
              coverArtUrl={album.coverArtUrl}
              title={album.name}
              artist={album.artists}
              artistIds={album.artistIds}
              releaseDate={releaseDate}
              spotifyId={albumId}
              averageRating={album.averageRating}
              numberOfRatings={album.numberOfRatings}
              type={album.type}
              isClickable={true}
            />
          );
        })}
      </div>
      <div className='recent-lists-container-title'>Recently Created Lists<Link to="/lists" className='see-more'>see more</Link></div>
      <div className="recent-lists-container">
        {recentLists.map(list => (
          <ListCard
            key={list._id}
            userName={list.userName}
            title={list.listName}
            listId={list._id}
            albums={list.albums}
            dateCreated={list.dateCreated}
            albumDetails={albumDetails}
          />
        ))}
      </div>
      <div className='newest-releases-container-title'>Newest releases<Link to="/albums" className='see-more' state={{ sortingMode: 'newest' }}>see more</Link></div>
      <div className="newest-releases-container">
        {newestReleases.map(({ albumId }) => {
          const album = albumDetails[albumId];
          if (!album) return null;
          const releaseDate = new Date(album.release_date).getFullYear();
          return (
            <AlbumCard
              key={albumId}
              coverArtUrl={album.coverArtUrl}
              title={album.name}
              artist={album.artists}
              artistIds={album.artistIds}
              releaseDate={releaseDate}
              spotifyId={albumId}
              averageRating={album.averageRating}
              numberOfRatings={album.numberOfRatings}
              type={album.type}
              isClickable={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
