import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlbumCard = ({ coverArtUrl, title, artist, releaseDate, mbid }) => {
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const navigate = useNavigate();
  const MAX_TITLE_SIZE = 28;
  const MAX_ARTIST_SIZE = 20; 

  const adjustTitleFontSize = () => {
    const MIN_TITLE_SIZE = 12; 
    let currentFontSize = MAX_TITLE_SIZE;

    while (titleRef.current.scrollHeight > titleRef.current.offsetHeight && currentFontSize > MIN_TITLE_SIZE) {
      currentFontSize--;
      titleRef.current.style.fontSize = `${currentFontSize}px`;
    }
  };

  const adjustArtistFontSize = () => {
    const MIN_ARTIST_SIZE = 12; 
    let currentFontSize = MAX_TITLE_SIZE;

    while (artistRef.current.scrollHeight > artistRef.current.offsetHeight && currentFontSize > MIN_ARTIST_SIZE) {
      currentFontSize--;
      artistRef.current.style.fontSize = `${currentFontSize}px`;
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      adjustTitleFontSize();
    }
  }, [title]); 

  useEffect(() => {
    if (artistRef.current) {
      adjustArtistFontSize();
    }
  }, [artist]); 

  const goToAlbumPage = () => {
    navigate(`/albumPage/${mbid}`);
  };
  

  return (
    <div className="album-card" onClick={goToAlbumPage} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') goToAlbumPage(); }}>
      <div className="cover-art" style={{ backgroundImage: `url(${coverArtUrl})` }}></div>
      <div className="album-info">
        <div ref={titleRef} className="album-title" style={{ fontSize: `${MAX_TITLE_SIZE}px` }}>{title}</div>
        <p ref={artistRef} className="album-artist"style={{ fontSize: `${MAX_ARTIST_SIZE}px` }}>{artist}</p>
        <p className="album-release-date">{releaseDate}</p>
      </div>
    </div>
  );
};

export default AlbumCard;

