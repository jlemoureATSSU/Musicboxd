import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AlbumCard = ({ coverArtUrl, title, artist, releaseDate, mbid,averageRating }) => {
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const navigate = useNavigate();
  const MAX_TITLE_SIZE = 25;
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
    let currentFontSize = MAX_ARTIST_SIZE;

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

  const formattedRating = averageRating ? (averageRating === 10 ? averageRating.toFixed(0) : averageRating.toFixed(1)) : 'N/A';

  const getRatingClassName = (ratingValue) => {
    const numRating = parseFloat(ratingValue);
    if (isNaN(numRating)) return '';

    if (numRating <= 4.9) return 'rating-red';
    if (numRating >= 5 && numRating <= 7.4) return 'rating-orange';
    if (numRating >= 7.5) return 'rating-green';
  };
  

  return (
    <div className="album-card" onClick={goToAlbumPage} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') goToAlbumPage(); }}>
      <div className="cover-art" style={{ backgroundImage: `url(${coverArtUrl})` }}></div>
      <div className="album-info">
      <div ref={titleRef} className="album-title" style={{ fontSize: `clamp(12px, 2.5vw, ${MAX_TITLE_SIZE}px)` }}>{title}</div>
        <p ref={artistRef} className="album-artist" style={{ fontSize: `clamp(12px, 2.2vw, ${MAX_ARTIST_SIZE}px)` }}>{artist}</p>
        <p className="album-release-date">{releaseDate}</p>
        <p className={`album-rating ${getRatingClassName(averageRating)}`}>{formattedRating}</p>
    </div>
  </div>
  );
};

export default AlbumCard;

