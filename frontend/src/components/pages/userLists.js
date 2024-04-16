import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListCard from '../listCard';
import { useParams, Link } from 'react-router-dom';

const UserLists = () => {
  const { username } = useParams();
  const [userLists, setUserLists] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchListsAndAlbumDetails = async () => {
      const limit = 7;
      const offset = page * limit;

      try {
        const response = await axios.get(`${backendUrl}/list/getAllListsByUser/${username}?limit=${limit}&offset=${offset}`);
        const newList = response.data;
        setUserLists(prev => [...prev, ...newList]);
        setHasMore(newList.length === limit);

        const listAlbumIds = newList.flatMap(list =>
            list.albums.slice(0, 3).map(album => album.id)
        );

        if (listAlbumIds.length > 0) {
          const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
            albumIds: listAlbumIds
          });
          const newDetails = detailsResponse.data.reduce((acc, detail) => {
            acc[detail.id] = detail;
            return acc;
          }, {});
          setAlbumDetails(prevDetails => ({ ...prevDetails, ...newDetails }));
        }
      } catch (error) {
        console.error('Error fetching lists and album details:', error);
        setHasMore(false);
      }
    };

    fetchListsAndAlbumDetails();
  }, [page, username, backendUrl]);

  const handleSeeMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className='lists-page'>
      <div className="user-ratings-header"><Link className='user-ratings-username' to={`/user/${username}`}>{username}</Link>Lists</div>
      <div className="user-lists-container">
        {userLists.map(list => (
          <ListCard
            key={list._id}
            userName={list.userName}
            title={list.listName}
            listId={list._id}
            albums={list.albums}
            dateCreated={list.dateCreated}
            albumDetails={albumDetails}
            likeCount={list.likeCount}
          />
        ))}
        {hasMore && (
          <div className="see-more-btn-container">
            <button onClick={handleSeeMore} className="see-more-btn">
              See More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLists;
