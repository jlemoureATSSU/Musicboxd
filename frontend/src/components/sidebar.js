import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

const Sidebar = () => {
  const user = useContext(UserContext);


  if (!user) return (
    <div className="sidebar">
      <Link to="/" className='home-link'>Musicboxd</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>
  );
  return (
    <div className="sidebar">
      <Link to="/" className='home-link'>Musicboxd</Link>
      <Link to="/createListPage">Create a List</Link>
      <Link to="/albums">Albums</Link>      
      <Link to="/privateUserProfile">Profile</Link>
    </div>
  );
};

export default Sidebar;