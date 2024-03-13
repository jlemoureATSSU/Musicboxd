import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListCard from '../listCard';

const Lists = () => {
    const [lists, setLists] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchListsAndAlbumDetails = async (nextPage) => {
        const limit = 5;
        const offset = nextPage * limit;
        let url = `${backendUrl}/list/getRecentLists?limit=${limit}&offset=${offset}`;

        try {
            const response = await axios.get(url);
            if (response.data.length > 0) {
                setLists(prevLists => [...prevLists, ...response.data]);
                const newAlbumIds = response.data.flatMap(list => 
                    list.albums.slice(0, 3).map(album => album.id)
                );
                fetchAlbumDetails(newAlbumIds);
                setHasMore(response.data.length === limit);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching lists:", error);
            setHasMore(false);
        }
    };

    const fetchAlbumDetails = async (albumIds) => {
        const uniqueAlbumIds = Array.from(new Set(albumIds));
        try {
            const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, {
                albumIds: uniqueAlbumIds
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

    useEffect(() => {
        fetchListsAndAlbumDetails(page);
    }, [page]);

    const handleSeeMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <div className='lists-page'>
            <div className='all-lists-header'>Lists</div>
            <div className="all-lists-container">
                {lists.map(list => (
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

export default Lists;
