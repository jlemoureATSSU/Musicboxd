import React, { useEffect, useState } from 'react';

const ShowMessage = ({ message, visible, onClose }) => {
    const [show, setShow] = useState(visible);

    useEffect(() => {
        let fadeOutTimer;
        if (visible) {
            setShow(true);
            fadeOutTimer = setTimeout(() => {
                closeMessage();  // Use the closeMessage function
            }, 3000);
        }
        return () => clearTimeout(fadeOutTimer);
    }, [visible, onClose]);

    useEffect(() => {
        if (!visible) {
            setShow(false);
        }
    }, [visible]);

    // Function to handle closing the message
    const closeMessage = () => {
        setShow(false);
        setTimeout(onClose, 2000);  // Delay the onClose prop to allow fade-out effect
    };

    const messageClasses = `rating-message ${show ? 'visible' : 'fade-out'}`;

    if (!visible) return null;

    return (
        <div className={messageClasses}>
            {message}
            <button onClick={closeMessage} style={{ marginLeft: '10px' }}>Close</button>
        </div>
    );
};

export default ShowMessage;
