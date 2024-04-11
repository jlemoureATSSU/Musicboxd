import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumCard from '../albumCard';
import { useParams } from 'react-router-dom';

const UserRatings = () => {
  const { username } = useParams();
  const [topRated, setTopRated] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAlbumsAndDetails = async () => {
      const limit = 10; 
      const offset = page * limit;

      try {
        const topRatedResponse = await axios.get(`${backendUrl}/rating/topRatings/${username}?limit=${limit}&offset=${offset}`);
        const newTopRated = topRatedResponse.data;
        setTopRated(prev => [...prev, ...newTopRated]);
        setHasMore(newTopRated.length === limit);

        const newAlbumIds = newTopRated.map(rating => rating.albumId);
        if (newAlbumIds.length > 0) {
          const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
            albumIds: newAlbumIds
          });
          const newDetails = detailsResponse.data.reduce((acc, detail) => {
            acc[detail.id] = detail;
            return acc;
          }, {});
          setAlbumDetails(prevDetails => ({ ...prevDetails, ...newDetails }));
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
        setHasMore(false);
      }
    };

    fetchAlbumsAndDetails();
  }, [page, username, backendUrl]);

  const handleSeeMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const UserRatedAlbumCard = ({ userRating, ...albumCardProps }) => {
    return (
      <div className="user-rated-album-card">
        <AlbumCard {...albumCardProps} />
        <div className="user-rating">Rating: {userRating}</div>
      </div>
    );
  };

  return (
    <div className='albums-page'>
      <div className="user-ratings-header">{username}'s Ratings</div>
      <div className="user-ratings-container">
        {topRated.map(rating => {
          const albumDetail = albumDetails[rating.albumId];
          return albumDetail ? (
            <UserRatedAlbumCard
              key={rating.albumId}
              userRating={rating.ratingNum}
              coverArtUrl={albumDetail.coverArtUrl}
              title={albumDetail.name}
              artist={albumDetail.artists}
              artistIds={albumDetail.artistIds}
              releaseDate={new Date(albumDetail.release_date).getFullYear()}
              spotifyId={albumDetail.id}
              averageRating={albumDetail.averageRating}
              numberOfRatings={albumDetail.numberOfRatings}
              type={albumDetail.type}
              isClickable={true}
            />
          ) : null;
        })}
        {hasMore && (
        <div className="see-more-btn-container">
          <button onClick={handleSeeMore} className="see-more-btn">
            see more
          </button>
        </div>
      )}
      </div>
    </div>
  );
};



export default UserRatings;
