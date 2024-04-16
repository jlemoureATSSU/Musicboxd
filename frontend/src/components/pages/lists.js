import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListCard from '../listCard';

const Lists = () => {
    const [lists, setLists] = useState([]);
    const [albumDetails, setAlbumDetails] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sortingMode, setSortingMode] = useState('recent');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchListsAndAlbumDetails = async () => {
        const limit = 7;
        const offset = page * limit;
        let url = `${backendUrl}/list/getRecentLists?limit=${limit}&offset=${offset}`;

        if (sortingMode === 'mostLiked') {
            url = `${backendUrl}/list/getMostLiked?limit=${limit}&offset=${offset}`;
        }

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
            console.error(`Error fetching lists for mode ${sortingMode}:`, error);
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
        fetchListsAndAlbumDetails();
    }, [page, sortingMode]);

    const handleSeeMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleChangeSortingMode = (newMode) => {
        if (newMode !== sortingMode) {
            setSortingMode(newMode);
            setLists([]);
            setPage(0);
            setHasMore(true);
        }
    };

    return (
        <div className='lists-page'>
            <div className="sorting-buttons">
                <button
                    className={`sort-button ${sortingMode === 'recent' ? 'active' : ''}`}
                    onClick={() => handleChangeSortingMode('recent')}
                >
                    Recent
                </button>
                <button
                    className={`sort-button ${sortingMode === 'mostLiked' ? 'active' : ''}`}
                    onClick={() => handleChangeSortingMode('mostLiked')}
                >
                    Most Liked
                </button>
            </div>
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
                        likeCount={list.likeCount}
                    />
                ))}
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

export default Lists;
