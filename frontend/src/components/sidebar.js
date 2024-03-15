import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { FaPlus, FaUser } from 'react-icons/fa';
import { PiVinylRecordBold } from 'react-icons/pi';
import { IoIosCreate } from 'react-icons/io';
import { CiLogin } from 'react-icons/ci';

const Sidebar = () => {
  const user = useContext(UserContext);
  const profileLink = user ? `/user/${user.username}` : '/login';

  return (
    <div className="sidebar">
      <Link to="/" className='home-link' title="Home">Musicboxd</Link>
      <div className="sidebar-links">
        {!user ? (
          <>
          <Link to="/albums" title="Albums"><PiVinylRecordBold className="icon-size"/>Albums</Link>
          <Link to="/login" title="Login"><CiLogin className="icon-size"/>Login</Link>

          </>
        ) : (
          <>
          <Link to="/edit" title="Create a List"><IoIosCreate className="icon-size"/>Create&nbsp;List</Link>
          <Link to="/albums" title="Albums"><PiVinylRecordBold className="icon-size"/>Albums</Link>
          <Link to={profileLink} title="Profile"><FaUser className="icon-size"/>Profile</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;