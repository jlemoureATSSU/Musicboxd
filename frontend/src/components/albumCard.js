import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AlbumCard = ({ coverArtUrl, title, artist, artistIds, releaseDate, spotifyId, isClickable }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [averageRating, setAverageRating] = useState(null);
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const navigate = useNavigate();
  const MAX_TITLE_SIZE = 30;
  const MAX_ARTIST_SIZE = 18; 

  useEffect(() => {
    const fetchAlbumRating = async () => {
      try {
        const response = await axios.get(`${backendUrl}/rating/getAvgByAlbum/${spotifyId}`);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching album rating:', error);
        setAverageRating('N/A'); 
      }
    };

    fetchAlbumRating();
  }, [spotifyId]);

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

    if (artistRef.current.scrollHeight > artistRef.current.offsetHeight && currentFontSize > MIN_ARTIST_SIZE) {
      currentFontSize--;
      artistRef.current.style.fontSize = `${currentFontSize}px`;
      console.log(`Adjusting artist font size to: ${currentFontSize}px`);

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
    if (isClickable) {
      navigate(`/album/${spotifyId}`);
    }
  };

  const formattedRating = typeof averageRating === 'number' 
  ? (averageRating === 10 ? averageRating.toFixed(0) : averageRating.toFixed(1))
  : 'N/A';

  const getRatingClassName = (ratingValue) => {
    const numRating = parseFloat(ratingValue);
    if (isNaN(numRating)) return '';

    if (numRating <= 4.9) return 'rating-red';
    if (numRating >= 5 && numRating <= 7.4) return 'rating-orange';
    if (numRating >= 7.5) return 'rating-green';
  };

  if (!Array.isArray(artistIds)) {
    console.error('Expected artistIds to be an array, but received:', artistIds);
    artistIds = []; 
  }

  const artistLink = artistIds.length > 0 ? (
    <Link 
      to={`/artist/${artistIds[0]}`}
      className="album-card-artist-link"
      onClick={(e) => e.stopPropagation()}
    >
      {artist}
    </Link>
  ) : (
    <span>{artist}</span>
  );
  
  

  return (
      <div 
      className="album-card" 
      onClick={goToAlbumPage} 
      role={isClickable ? "button" : undefined} 
      tabIndex={isClickable ? 0 : undefined} 
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter') goToAlbumPage(); } : undefined}
    >
      <div className="album-card-cover-art" style={{ backgroundImage: `url(${coverArtUrl})` }}></div>
      <div className="album-card-info">
      <div ref={titleRef} className="album-card-title" style={{ fontSize: `clamp(12px, 2.5vw, ${MAX_TITLE_SIZE}px)` }}>{title}</div>
        <p ref={artistRef} className="album-card-artist" style={{ fontSize: `clamp(12px, 2.5vw, ${MAX_ARTIST_SIZE}px)` }}>{artistLink}</p>
        <p className="album-card-release-date">{releaseDate}</p>
        <p className={`album-card-rating ${getRatingClassName(averageRating)}`}>{formattedRating}</p>
    </div>
  </div>
  );
};

export default AlbumCard;

