import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AlbumCard from '../albumCard';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { debounce } from 'lodash';
import getUserInfo from "../../utilities/decodeJwt"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const CreateListPage = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [user, setUser] = useState({})
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [albums, setAlbums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { listId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleTitleChange = (e) => setListTitle(e.target.value);
  const handleDescriptionChange = (e) => setListDescription(e.target.value);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);



  useEffect(() => {
    const fetchListDetails = async () => {
      if (listId) {
        try {
          const listResponse = await axios.get(`${backendUrl}/list/getListById/${listId}`);
          const { listName, listDescription, albums } = listResponse.data;

          setListTitle(listName);
          setListDescription(listDescription);

          const albumDetailsResponses = await Promise.all(
            albums.map((album) =>
              axios.get(`${backendUrl}/api/getAlbumDetails/${album.id}`)
            )
          );
          const detailedAlbums = albumDetailsResponses.map(response => {
            return {
              id: response.data.id,
              coverArtUrl: response.data.coverArtUrl,
              name: response.data.name,
              artist: response.data.artists,
              releaseDate: new Date(response.data.release_date).getFullYear(),
              type: response.data.type,
            };
          });
          setAlbums(detailedAlbums);

        } catch (error) {
          console.error('Error fetching list details:', error);
        }
      }

      const setUserInfo = async () => {
        const info = await getUserInfo();
        setUser(info);
      };

      setUserInfo();
    };

    fetchListDetails();
  }, [listId]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);
      const isLoggedIn = userInfo && userInfo.username;
      setShowLoginPrompt(!isLoggedIn);
    };

    checkLoginStatus();
  }, []);

  const searchAlbums = debounce(async (search) => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/api/searchAlbums?search=${encodeURIComponent(search)}`);
      const albums = response.data.albums.map(album => ({
        id: album.id,
        name: album.name,
        artist: album.artists,
        releaseDate: new Date(album.release_date).getFullYear(),
        coverArtUrl: album.coverArtUrl
      }));
      setSearchResults(albums);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  }, 300);

  useEffect(() => {
    searchAlbums(searchTerm);
    return () => searchAlbums.cancel();
  }, [searchTerm]);

  const handleSelectAlbum = (album) => {
    addAlbumToList(album);
    setIsModalOpen(false);
  };



  const fetchAlbumsFromPlaylist = async () => {
    try {
      const idsResponse = await axios.get(`${backendUrl}/api/getAlbumsFromPlaylist?url=${encodeURIComponent(playlistUrl)}`);
      const albumIds = idsResponse.data.albumIds;

      if (albumIds.length > 0) {
        const detailsResponse = await axios.post(`${backendUrl}/api/getMultipleAlbumDetails`, { albumIds });
        const detailedAlbums = detailsResponse.data;

        setAlbums(detailedAlbums.map(album => ({
          id: album.id,
          coverArtUrl: album.coverArtUrl,
          name: album.name,
          artist: album.artists,
          type: album.type,
          releaseDate: new Date(album.release_date).getFullYear()
        })));
      }
      setPlaylistUrl('');
    } catch (error) {
      console.error('Error fetching albums from playlist:', error);
    }
  };


  const addAlbumToList = (albumDetails) => {
    if (albums.some((a) => a.id === albumDetails.id)) {
      alert("This album is already added to the list.");
      return;
    }
    setAlbums(prevAlbums => [
      ...prevAlbums,
      albumDetails
    ]);

    setIsModalOpen(false);
  };

  const handleSaveList = async () => {
    if (!user.username) {
      setShowLoginPrompt(true);
      return;
    }

    const finalListTitle = listTitle || "Untitled List";

    const listData = {
      userName: user.username,
      listName: finalListTitle,
      listDescription: listDescription,
      albums: albums.map((album) => ({ id: album.id })),
    };

    if (listId) {
      listData._id = listId;
    }

    try {
      const response = await axios.post(`${backendUrl}/list/save`, listData);
      console.log('List saved:', response.data);
      const savedListId = response.data._id;
      navigate(`/list/${savedListId}`);
    } catch (error) {
      console.error('Error saving the list:', error);
    }
  };


  const handleDiscardList = () => {
    setListTitle('');
    setListDescription('');
    setAlbums([]);
    setPlaylistUrl('');
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      albums,
      result.source.index,
      result.destination.index
    );

    setAlbums(items);
  };

  const removeAlbum = (albumId) => {
    setAlbums(albums.filter(album => album.id !== albumId));
  };


  return (
    <div className={`create-list-page ${showLoginPrompt ? 'blur' : ''}`}>
      <div className="list-input-card">
        <div className="list-inputs">
          <input type="text" placeholder="List Title" value={listTitle} onChange={handleTitleChange} className="list-title-input" />
          <textarea placeholder="List Description" value={listDescription} onChange={handleDescriptionChange} className="list-description-input" />
        </div>
        <div className="playlist-input">
          <textarea
            className="playlist-url-input"
            placeholder="Drag Spotify Playlist, or paste URL here to add albums that appear in that playlist to this List. (Note: This will remove all other albums added to the List. Only public playlists are supported)"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />

          {playlistUrl.trim() && (
            <button onClick={fetchAlbumsFromPlaylist} className="add-playlist-btn">Add to List</button>
          )}
        </div>
      </div>
      <div className="list-actions">
        <div onClick={handleDiscardList} className="discard-btn">Start Over</div>
        <div onClick={handleSaveList} className="save-btn">Save List</div>
        {albums.length < 20 ? (
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>Add an Album</button>
        ) : (
          <div className="max-reached">MAX Albums (20)</div>
        )}
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} dialogClassName="album-search-modal">
          <Modal.Header>
            <Modal.Title>Add an Album</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="search-input"
              placeholder="Search for an album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="modal-search-results">
              {searchResults.map((album) => (
                <div
                  key={album.id}
                  className="search-result-item"
                  onClick={() => handleSelectAlbum(album)}
                >
                  <img src={album.coverArtUrl} className="search-album-cover-art" />{album.name} by <span className="search-album-artist">{album.artist}</span> <span className="album-year">({album.releaseDate})</span>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="album-list-card">
              {albums.map((album, index) => (
                <Draggable key={album.id} draggableId={album.id} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style }} className="album-wrapper">
                      <button onClick={() => removeAlbum(album.id)} className="remove-album-btn">remove album</button>
                      <AlbumCard
                        coverArtUrl={album.coverArtUrl}
                        title={album.name}
                        artist={album.artist}
                        releaseDate={album.releaseDate}
                        spotifyId={album.id}
                        type={album.type}
                        isClickable={false}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {showLoginPrompt && (
        <div className="login-prompt-overlay">
          <div className="login-prompt">
            <p>Please log in to create a list.</p>
            <button onClick={() => navigate('/login')}>Log In</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateListPage;
