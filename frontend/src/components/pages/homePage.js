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
    <div className="main">
      <h2>Recently Uploaded Lists</h2>
      <div className="recent-lists-container">
        {recentLists.map(list => (
          <ListCard
            key={list._id}
            userName={list.userName}
            title={list.listName}
            listId={list._id}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;