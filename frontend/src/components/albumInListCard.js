import React from 'react';
import '../css/albumInListCard.css';

const AlbumInListCard = ({ album, index }) => {
  return (
    <div className="album-card">
      <div className="album-rank">#{index + 1}</div>
      <div className="album-info">
        <div className="album-name">{album.name}</div>
        <div className="album-artist">by {album.artist}</div>
        <div className="album-year">Release year: {album.year}</div>
        <div className="album-added">added on {album.addedDate}</div>
      </div>
    </div>
  );
};

export default AlbumInListCard;
