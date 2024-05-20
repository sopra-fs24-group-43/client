import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/views/ClientSettings.scss";



const ClientSettings = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(sessionStorage.getItem("isDarkMode")||false);


  const handleToggleDarkMode = () => {
    if(sessionStorage.getItem("isDarkMode")) {setIsDarkMode(true);}
    if(!isDarkMode) {sessionStorage.setItem("isDarkMode","_dark");}
    else {sessionStorage.setItem("isDarkMode","");}
    setIsDarkMode(!isDarkMode);

  };

  if (!isOpen) return null;

  return (
    <div className={`client-settings ${isOpen ? "open" : ""}`}>
      <div className={`modal-content`}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Settings</h2>
        <div className={"setting-option"}>
          <label>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={handleToggleDarkMode}
            />
            Dark Mode
          </label>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

ClientSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ClientSettings;