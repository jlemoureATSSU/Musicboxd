import React, { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import './css/style.css';
import './css/sidebar.css';
import './css/searchbar.css';
import './css/login.css';
import Sidebar from "./components/sidebar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import AlbumPage from "./components/pages/albumPage";
import ArtistPage from "./components/pages/artistPage";
import SearchBar from "./components/searchbar";
import AlbumCard from "./components/albumCard";
import TracklistBox from "./components/tracklistBox";
import getUserInfo from "./utilities/decodeJwt";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <SearchBar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/albumPage/:mbid" element={<AlbumPage />} />
          <Route path="/artistPage/:mbid" element={<ArtistPage />} />
          <Route path="/searchBar" element={<SearchBar />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
};

export default App;
