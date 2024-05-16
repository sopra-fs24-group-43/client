import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Settings.scss";
import {useLocation, useNavigate} from "react-router-dom";


const Settings = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("isDarkMode")||false);


  const handleToggleDarkMode = () => {
    if(localStorage.getItem("isDarkMode")) {setIsDarkMode(true);}
    if(!isDarkMode) {localStorage.setItem("isDarkMode","_dark");}
    else {localStorage.setItem("isDarkMode","");}
    setIsDarkMode(!isDarkMode);

  };

  if (!isOpen) return null;

  return (
    <div className={`settings ${isOpen ? "open" : ""}`}>
      <div className={`modal-content${localStorage.getItem("isDarkMode") ? '_dark' : ''}`}>
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

Settings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Settings;
