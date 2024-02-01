import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListCard from '../listCard';

const HomePage = () => {
    const [recentLists, setRecentLists] = useState([]);

    useEffect(() => {
        const fetchRecentLists = async () => {
          try {
            const response = await axios.get('http://localhost:8081/list/getAllLists');
            setRecentLists(response.data);
          } catch (error) {
            console.error('Error fetching recent lists:', error);
          }
        };
    
        fetchRecentLists();
      }, []);

  return (
    <div>
      <div className='homepage-containter-title'>Recently Created Lists</div>
      <div className="recent-lists-container">
        {recentLists.map(list => (
          <ListCard
          userName={list.userName}
          title={list.listName}
          listId={list._id}
          albums={list.albums} 
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;