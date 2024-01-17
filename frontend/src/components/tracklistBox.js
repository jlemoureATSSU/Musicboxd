import React from 'react';

const TracklistBox = ({ tracklist, formatLength }) => {
    return (
        <div className="tracklist-box">
            <h2>Tracklist</h2>
            <ul>
                {tracklist.map(track => (
                    <li key={track.number}>
                        {track.number}. {track.title} - {formatLength(track.length)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TracklistBox;
