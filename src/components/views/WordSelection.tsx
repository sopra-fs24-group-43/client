import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/views/game/WordSelection.scss';



const WordSelection = ({ gamePhase, onClose, time, isDrawer, sendWordChoice, threeWords }) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [wordIndex, setWordIndex] = useState()
  let threeWords2 = threeWords
  if (gamePhase !== "choosing") return null;

  if (!isDrawer) {
    return (
      <div className={`wordSelection container ${gamePhase==="choosing" ? 'open' : ''}`}>
        <div className="wordSelection modal-content">
          <div className="wordSelection title">
            Drawer Is Choosing A Word! {time}
          </div>
        </div>
      </div>
    );
  }
  if(isDrawer) {
    return (
      <div className={`wordSelection container ${gamePhase==="choosing" ? 'open' : ''}`}>
        <div className="wordSelection modal-content">
          <div className="wordSelection title">
            Select a word to draw! {time}
          </div>
          <div className="wordSelection words-container">
            <div className="wordSelection words">
              <button onClick={() => sendWordChoice(0, threeWords)}>
                {threeWords2[0].charAt(0).toUpperCase() + threeWords2[0].slice(1)}
              </button>
            </div>
            <div className="wordSelection words">
              <button onClick={() => sendWordChoice(1, threeWords)}>
                {threeWords2[1].charAt(0).toUpperCase() + threeWords2[1].slice(1)}
              </button>
            </div>
            <div className="wordSelection words">
              <button onClick={() => sendWordChoice(2, threeWords)}>
                {threeWords2[2].charAt(0).toUpperCase() + threeWords2[2].slice(1)}
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

WordSelection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WordSelection;
