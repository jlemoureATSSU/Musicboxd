import React from 'react';
import { Link } from 'react-router-dom';
import { MdIosShare } from "react-icons/md";
import { MdAddToHomeScreen } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";


const Welcome = () => {
  return (
    <div className="welcome">
      <h1>Welcome to...</h1>
        <h2>Musicboxd</h2>
      <p>A web application for music lovers. Here you can rate albums, add albums to lists, and explore new music.</p>
      
      <div className="welcome-links">
        <Link to="/" className="welcome-link">Home</Link>
        <Link to="/login" className="welcome-link">Login</Link>
        <Link to="/signup" className="welcome-link">Sign Up</Link>
      </div>

      <p className="mobile-message">For the best experience on mobile, add Musicboxd to your home screen. Look for an icon like this... <MdIosShare /> or this... <FaShareAlt />. Then look for "Add to Home Screen" or <CiSquarePlus />, or <MdAddToHomeScreen />.    </p>
    </div>
  );
};

export default Welcome;
