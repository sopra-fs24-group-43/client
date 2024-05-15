import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/views/game/WordSelection.scss';


const WordSelection = ({ isOpen, onClose }) => {
  const [isChoosing, setIsChoosing] = useState(false);

  if (!isOpen) return null;

  return (
    <div className={`wordSelection container ${isOpen ? 'open' : ''}`}>
      <div className="wordSelection modal-content">
      <div className="wordSelection title">
        Select a word to draw!
      </div>
      <div className="wordSelection words-container">
        <div className="wordSelection words">
          House
        </div>
        <div className="wordSelection words">
          Tree
        </div>
        <div className="wordSelection words">
          Keyboard
        </div>
      </div>
      </div>
      
      <div className="wordSelection close">
      <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

WordSelection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WordSelection;
