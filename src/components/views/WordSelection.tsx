import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/views/game/WordSelection.scss';



const WordSelection = ({ isOpen, onClose, time, isDrawer, sendWordChoice, threeWords }) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [wordIndex, setWordIndex] = useState()
  let threeWords2 = threeWords
  if (!isOpen) return null;

  if (!isDrawer) {
    return (
      <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container ${isOpen ? 'open' : ''}`}>
        <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} modal-content`}>
          <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} title`}>
            Drawer Is Choosing A Word! {time}
          </div>
        </div>
      </div>
    );
  }
  if(isDrawer) {
    return (
      <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} ${isOpen ? 'open' : ''}`}>
        <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} modal-content`}>
          <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} title`}>
            Select a word to draw! {time}
          </div>
          <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} words-container`}>
            <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} words`}>
              <button onClick={() => sendWordChoice(0, threeWords)}>
                {threeWords2[0].charAt(0).toUpperCase() + threeWords2[0].slice(1)}
              </button>
            </div>
            <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} words`}>
              <button onClick={() => sendWordChoice(1, threeWords)}>
                {threeWords2[1].charAt(0).toUpperCase() + threeWords2[1].slice(1)}
              </button>
            </div>
            <div className={`wordSelection${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} words`}>
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
