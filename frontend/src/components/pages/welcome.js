import React from 'react';
import { Link } from 'react-router-dom';
import { MdIosShare } from "react-icons/md";
import { MdAddToHomeScreen } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";




const Welcome = () => {
  return (
    <div className="welcome">
      <h1>Welcome to...</h1>
        <div className='musicboxd'>Musicboxd</div>
      <p>An app for music lovers. Here you can rate albums, add albums to lists, and explore new music.</p>
      <p>Developed by Joseph LeMoure...
        <a href="https://www.linkedin.com/in/joseph-lemoure-a835a0291/" className="icon-linkedin" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://github.com/jlemoureATSSU/Musicboxd" className="icon-github" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
      </p>      
      <div className="welcome-links">
        <Link to="/" className="welcome-link">Home</Link>
        <Link to="/login" className="welcome-link">Login</Link>
      </div>

      <p className="mobile-message">For the best experience on mobile, add <span className='s-musicboxd'>Musicboxd</span> to your home screen. Look for <MdIosShare /> or <FaShareAlt />. Then "Add to Home Screen" or <CiSquarePlus />, or <MdAddToHomeScreen />. </p>
      <p className="message">
        <p>When you see an album, like this...</p>
        <img src="/albumCard.png" alt="Album Card" className="album-card-img" />
        <p>Clicking on it will lead to a page where you can rate the album, and do much more!</p>
        <p>The number at the bottom right tells you the rating for this album, which is the average of all the ratings that <span className='s-musicboxd'>Musicboxd</span> users have given it.</p>
      </p>
    </div>
  );
};

export default Welcome;
