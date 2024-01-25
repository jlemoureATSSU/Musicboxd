import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/home" className='home-link'>Musicboxd</Link>
      <Link to="/createListPage">Create A List</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/privateUserProfile">Private User Profile</Link>

    </div>
  );
};

export default Sidebar;
