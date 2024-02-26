import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { FaPlus, FaUser } from 'react-icons/fa';
import { PiVinylRecordBold } from 'react-icons/pi';
import { IoIosCreate } from 'react-icons/io';

const Sidebar = () => {
  const user = useContext(UserContext);
  return (
    <div className="sidebar">
      <Link to="/" className='home-link' title="Home">Musicboxd</Link>
      <div className="sidebar-links">
        {!user ? (
          <>
            <Link to="/login" title="Login"><FaPlus /></Link>
            <Link to="/signup" title="Signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/createListPage" title="Create a List"><IoIosCreate /></Link>
            <Link to="/albums" title="Albums"><PiVinylRecordBold /></Link>
            <Link to="/privateUserProfile" title="Profile"><FaUser /></Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;