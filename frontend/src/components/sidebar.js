import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./searchbar";
import { UserContext } from "../App";
import { FaPlus, FaUser } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { VscChromeClose } from "react-icons/vsc";
import { PiVinylRecordBold } from "react-icons/pi";
import { IoIosCreate } from "react-icons/io";
import { CiLogin } from "react-icons/ci";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useContext(UserContext);
  const profileLink = user ? `/user/${user.username}` : "/login";

  useEffect(() => {
    const closeMenu = (e) => {
      // Ensure that the menu and hamburger are not the targets of the click
      if (isMenuOpen && !e.target.closest(".sidebar")) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("click", closeMenu);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleMenu();
    }
  };

  return (
    <div className="sidebar">
      <Link to="/" className="home-link" title="Home">
        Musicboxd
      </Link>
      <div
        className="hamburger"
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-expanded={isMenuOpen}
        role="button"
        tabIndex={0}
      >
        {isMenuOpen ? <VscChromeClose /> : <FaBars />}
      </div>
      {isMenuOpen && (
        <div className="pop-out-menu">
          {!user ? (
            <>
              <Link to="/edit" title="Create a List" onClick={closeMenu}>
                <IoIosCreate className="icon-size" />
                Create a List
              </Link>
              <Link to="/albums" title="Albums" onClick={closeMenu}>
                <PiVinylRecordBold className="icon-size" />
                Albums
              </Link>
              <Link to="/login" title="Login" onClick={closeMenu}>
                <CiLogin className="icon-size" />
                Login
              </Link>
              <Link to="/welcome" title="about" onClick={closeMenu}>
              <FaUser className="icon-size" />
                About
              </Link>
            </>
          ) : (
            <>
              <Link to="/edit" title="Create a List" onClick={closeMenu}>
                <IoIosCreate className="icon-size" />
                Create a List
              </Link>
              <Link to="/albums" title="Albums" onClick={closeMenu}>
                <PiVinylRecordBold className="icon-size" />
                Albums
              </Link>
              <Link to={profileLink} title="Profile" onClick={closeMenu}>
                <FaUser className="icon-size" />
                Profile
              </Link>
              <Link to="/welcome" title="about" onClick={closeMenu}>
              <img src="/Mblogo.png" className="mb-logo" />
               About
              </Link>
            </>
          )}
        </div>
      )}
      <div className="sidebar-links">
        {!user ? (
          <>
            <Link to="/edit" title="Create a List">
              <IoIosCreate className="icon-size" />
              Create&nbsp;List
            </Link>
            <Link to="/albums" title="Albums">
              <PiVinylRecordBold className="icon-size" />
              Albums
            </Link>
            <Link to="/login" title="Login">
              <CiLogin className="icon-size" />
              Login
            </Link>
            <Link to="/welcome" title="about">
            <img src="/Mblogo.png" className="mb-logo" />
              About
            </Link>
          </>
        ) : (
          <>
            <Link to="/edit" title="Create a List">
              <IoIosCreate className="icon-size" />
              Create&nbsp;List
            </Link>
            <Link to="/albums" title="Albums">
              <PiVinylRecordBold className="icon-size" />
              Albums
            </Link>
            <Link to={profileLink} title="Profile">
              <FaUser className="icon-size" />
              Profile
            </Link>
            <Link to="/welcome" title="about">
            <img src="/Mblogo.png" className="mb-logo" />
              About
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
