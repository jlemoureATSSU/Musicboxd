import React, { createContext, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import './css/style.css';
import './css/albumCard.css';
import './css/sidebar.css';
import './css/searchbar.css';
import './css/login.css';
import './css/createlist.css';
import './css/listPage.css';
import './css/listCard.css';
import './css/albumPage.css';
import './css/artistPage.css';
import './css/showMessage.css';
import './css/profile.css';
import './css/lists.css';
import './css/welcome.css';
import Welcome from "./components/pages/welcome";
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
import Lists from "./components/pages/lists";
import UserRatings from "./components/pages/userRatings";
import UserLists from "./components/pages/userLists";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();
  const location = useLocation();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const isLoggedIn = Boolean(user);
  const showSidebarAndSearchBar = location.pathname !== "/welcome";


  return (
    <div className="app">
      <UserContext.Provider value={user}>
        {showSidebarAndSearchBar && <Sidebar isLoggedIn={isLoggedIn} />}
        {showSidebarAndSearchBar && <SearchBar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/edit" element={<CreateListPage />} />
          <Route path="/edit/:listId" element={<CreateListPage />} />
          <Route path="/album/:spotifyId" element={<AlbumPage />} />
          <Route path="/artist/:artistSpotifyId" element={<ArtistPage />} />
          <Route path="/list/:listId" element={<ListPage />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/ratings/:username" element={<UserRatings />} />
          <Route path="userLists/:username" element={<UserLists />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
};

export default App;
