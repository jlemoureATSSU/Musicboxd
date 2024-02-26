import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AlbumSearchModal from '../albumSearchModal';
import AlbumCard from '../albumCard';
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
  const handleTitleChange = (e) => setListTitle(e.target.value);
  const handleDescriptionChange = (e) => setListDescription(e.target.value);
  
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
              releaseDate: new Date(response.data.release_date).getFullYear() 
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
    const listData = {
      userName: user.username,
      listName: listTitle,
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
      navigate(`/listPage/${savedListId}`);
    } catch (error) {
      console.error('Error saving the list:', error);
    }
  };

  const handleDiscardList = () => {
    setListTitle('');
    setListDescription('');
    setAlbums([]);
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
    <div className="create-list-page">
      <div className="list-input-card">
        <input type="text" placeholder="List Title" value={listTitle} onChange={handleTitleChange} className="list-title-input"/>
        <textarea placeholder="List Description" value={listDescription} onChange={handleDescriptionChange}className="list-description-input"/>
        <div className="list-actions">
          <button onClick={handleDiscardList} className="discard-btn">Discard</button>
          <div className="add-btn" onClick={() => setIsModalOpen(true)}>Add Album</div>
          <button onClick={handleSaveList} className="save-btn">Save List</button>
        </div>
        </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="album-list-card">
                    <div className="album-list">
                    {albums.map((album, index) => (
                        <Draggable key={album.id} draggableId={album.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style,}}className="album-wrapper">
                              <button onClick={() => removeAlbum(album.id)} className="remove-album-btn">remove album</button>
                              <AlbumCard
                                coverArtUrl={album.coverArtUrl}
                                title={album.name}
                                artist={album.artist}
                                releaseDate={album.releaseDate}
                                spotifyId={album.id}
                                isClickable={false} 
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
      <AlbumSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectAlbum={addAlbumToList}
      />
    </div>
  );
}

export default CreateListPage;
