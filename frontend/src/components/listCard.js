import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListCard = ({ userName, title, listId, albums, dateCreated, albumDetails }) => {
  const navigate = useNavigate();

  const coverArts = albums.slice(0, 3).map(album =>
    albumDetails[album.id]?.coverArtUrl
  ).filter(url => url);

  const handleClick = (e) => {
    if (e.target.tagName === 'A') {
      e.stopPropagation();
    } else {
      navigate(`/list/${listId}`);
    }
  };

  const formattedDate = new Date(dateCreated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="list-card" onClick={handleClick}>
      <div className="list-card-header">
        <div className="list-card-title">{title}</div>
        <span className="list-card-username">
          <Link to={`/user/${userName}`}>{userName}</Link>
        </span>
      </div>
      <div className="list-card-content">
        <div className="list-card-album-previews">
          {coverArts.map((coverArtUrl, index) => (
            <img key={index} src={coverArtUrl} alt={`Album cover ${index + 1}`} />
          ))}
          {albums.length > 3 && <div>+ {albums.length - 3}</div>}
        </div>
        <div className="list-card-date">{formattedDate}</div>
      </div>
    </div>
  );
};

export default ListCard;
