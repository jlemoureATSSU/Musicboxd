import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ userName, title, listId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listPage/${listId}`);
  };

  return (
    <div className="list-card" onClick={handleClick}>
      <div className="list-card-title">{title} by {userName}</div>
    </div>
  );
};

export default ListCard;
