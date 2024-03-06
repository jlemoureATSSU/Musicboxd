import React, { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import './css/style.css';
import './css/albumCard.css';
import './css/sidebar.css';
import './css/searchbar.css';
import './css/login.css';
import './css/createlist.css';
import './css/listCard.css';
import './css/albumPage.css';
import './css/artistPage.css';
import './css/showMessage.css';
import './css/profile.css';
import './css/toolTip.css';
import Sidebar from "./components/sidebar";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import Profile from "./components/pages/profilePage";
import AlbumPage from "./components/pages/albumPage";
import ArtistPage from "./components/pages/artistPage";
import CreateListPage from "./components/pages/createListPage";
import SearchBar from "./components/searchbar";
import getUserInfo from "./utilities/decodeJwt";
import ListPage from "./components/pages/listPage";
import Albums from "./components/pages/albums";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const isLoggedIn = Boolean(user);

  return (
    <div className="app">
      <UserContext.Provider value={user}>
      <Sidebar isLoggedIn={isLoggedIn} />
      <SearchBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/createList" element={<CreateListPage />}/>
          <Route path="/createList/:listId" element={<CreateListPage />} />
          <Route path="/album/:spotifyId" element={<AlbumPage />} />
          <Route path="/artist/:artistSpotifyId" element={<ArtistPage />} />
          <Route path="/list/:listId" element={<ListPage />} />
          <Route path="/albums" element={<Albums />} />

        </Routes>
      </UserContext.Provider>
    </div>
  );
};

export default App;
