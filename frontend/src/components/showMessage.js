import React, { useEffect, useState } from 'react';

const ShowMessage = ({ message, visible, onClose }) => {
    const [show, setShow] = useState(visible);

    useEffect(() => {
        let fadeOutTimer;
        if (visible) {
            setShow(true); 
            fadeOutTimer = setTimeout(() => {
                setShow(false); 
                setTimeout(onClose, 2000); 
            }, 3000); 
        }
        return () => clearTimeout(fadeOutTimer);
    }, [visible, onClose]);

    useEffect(() => {
        if (!visible) {
            setShow(false);
        }
    }, [visible]);

    const messageClasses = `rating-message ${show ? 'visible' : 'fade-out'}`;

    if (!visible) return null;

    return (
        <div className={messageClasses}>
            {message}
        </div>
    );
};

export default ShowMessage;
