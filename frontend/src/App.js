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
import Sidebar from "./components/sideBar";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import AlbumPage from "./components/pages/albumPage";
import ArtistPage from "./components/pages/artistPage";
import CreateListPage from "./components/pages/createListPage";
import SearchBar from "./components/searchBar";
import getUserInfo from "./utilities/decodeJwt";
import ListPage from "./components/pages/listPage";
import AllAlbums from "./components/pages/allAlbumsPage";

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
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/createListPage" element={<CreateListPage />}/>
          <Route path="/albumPage/:mbid" element={<AlbumPage />} />
          <Route path="/artistPage/:mbid" element={<ArtistPage />} />
          <Route path="/searchBar" element={<SearchBar />} />
          <Route path="/listPage/:listId" element={<ListPage />} />
          <Route path="/allAlbumsPage" element={<AllAlbums />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
};

export default App;
