import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlbumCard = ({ coverArtUrl, title, artist, releaseDate, mbid }) => {
  const titleRef = useRef(null);
  const navigate = useNavigate();
  const MAX_FONT_SIZE = 25; // Maximum font size for the title

  const adjustTitleFontSize = () => {
    const MIN_FONT_SIZE = 12; // Minimum font size for the title
    let currentFontSize = MAX_FONT_SIZE;

    while (titleRef.current.scrollHeight > titleRef.current.offsetHeight && currentFontSize > MIN_FONT_SIZE) {
      currentFontSize--;
      titleRef.current.style.fontSize = `${currentFontSize}px`;
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      adjustTitleFontSize();
    }
  }, [title]); // Run effect when title changes

  const goToAlbumPage = () => {
    navigate(`/albumPage/${mbid}`);
  };
  

  return (
    <div className="album-card" onClick={goToAlbumPage} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') goToAlbumPage(); }}>
      <div className="cover-art" style={{ backgroundImage: `url(${coverArtUrl})` }}></div>
      <div className="album-info">
        <div ref={titleRef} className="album-title" style={{ fontSize: `${MAX_FONT_SIZE}px` }}>{title}</div>
        <p className="album-artist">{artist}</p>
        <p className="album-release-date">{releaseDate}</p>
      </div>
    </div>
  );
};

export default AlbumCard;

