import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListCard = ({ userName, title, listId, albums }) => {
  const navigate = useNavigate();
  const [coverArts, setCoverArts] = useState([]);

  useEffect(() => {
    const fetchCoverArts = async () => {
      const requests = albums.slice(0, 4).map(album => 
        axios.get(`http://localhost:8081/api/getAlbumDetails/${album.id}`)
      );
  
      try {
        const responses = await Promise.all(requests);
        const coverArts = responses.map(res => res.data.coverArtUrl).filter(url => url);
        setCoverArts(coverArts);
      } catch (error) {
        console.error("Error fetching album details", error);
      }
    };
  
    if (albums && albums.length > 0) {
      fetchCoverArts();
    }
  }, [albums]);
  

  const handleClick = () => {
    navigate(`/listPage/${listId}`);
  };

  return (
    <div className="list-card" onClick={handleClick}>
      <div className="list-card-title"> {title} 
      <span className="list-card-username">{userName}</span>
      </div>
      <div className="list-card-album-previews">
        {coverArts.map((coverArtUrl, index) => (
          <img key={index} src={coverArtUrl} alt={`Album cover ${index + 1}`} />
        ))}
        {albums && albums.length > 4 && <div>+ {albums.length - 4} more</div>}
      </div>
    </div>
  );
};

export default ListCard;
