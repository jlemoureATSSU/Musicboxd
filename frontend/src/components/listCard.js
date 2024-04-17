import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa";


const ListCard = ({ userName, title, listId, albums, dateCreated, albumDetails, likeCount  }) => {
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

  function timeSince(dateCreated) {
    const date = new Date(dateCreated);
    const now = new Date();
    const differenceInSeconds = Math.floor((now - date) / 1000);
    const daysDifference = Math.floor(differenceInSeconds / (3600 * 24));
    const hoursDifference = Math.floor(differenceInSeconds / 3600);
    const minutesDifference = Math.floor(differenceInSeconds / 60);
  
    if (daysDifference < 1) {
      if (hoursDifference < 1) {
        if (minutesDifference < 1) {
          return "now";
        }
        return `${minutesDifference}m ago`;
      }
      return `${hoursDifference}h ago`;
    } else if (daysDifference === 1) {
      return "1d ago";
    } else {
      return `${daysDifference}d ago`;
    }
  }
  

  const formattedDate = timeSince(dateCreated);

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
        <div className="list-card-info">
          <div className="list-card-date">{formattedDate}</div>
          <div className="list-card-likes">
            <span>{likeCount} <FaRegHeart className="fa-heart" color="red" /> </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
