import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListCard = ({ userName, title, listId, albums }) => {
  const navigate = useNavigate();
  const [coverArts, setCoverArts] = useState([]);

  useEffect(() => {
    const fetchCoverArts = async () => {
      const arts = [];
      // Ensure albums is defined and has a length
      if (albums && albums.length) {
        for (let i = 0; i < Math.min(4, albums.length); i++) {
          try {
            const albumId = albums[i].id; // Access the id of the album
            const coverResponse = await axios.get(`http://coverartarchive.org/release-group/${albumId}`);
            if (coverResponse.data.images && coverResponse.data.images.length > 0) {
              arts.push(coverResponse.data.images[0].image);
            }
          } catch (error) {
            console.error("Error fetching cover art", error);
          }
        }
      }
      setCoverArts(arts);
    };

    fetchCoverArts();
  }, [albums]); // Dependency array now depends on the albums prop

  const handleClick = () => {
    navigate(`/listPage/${listId}`);
  };

  return (
    <div className="list-card" onClick={handleClick}>
      <div className="list-card-title"> {title} 
      <span className="list-card-username">by {userName}</span>
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
