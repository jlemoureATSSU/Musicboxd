import React from 'react';
import AlbumCard from './albumCard';

const CardDisplay = ({ albums, artistName }) => {
    return (
        <div className="artist-albums-container">
            {albums.map((album) => (
                <AlbumCard
                    key={album.id}
                    spotifyId={album.id}
                    coverArtUrl={album.coverArtUrl}
                    title={album.name}
                    artist={artistName || 'Various Artists'}
                    artistIds={album.artistIds}
                    releaseDate={new Date(album.release_date).getFullYear()}
                    averageRating={album.averageRating}
                    numberOfRatings={album.numberOfRatings}
                    type={album.type}
                    isClickable={true}
                />
            ))}
        </div>
    );
};

export default CardDisplay;
