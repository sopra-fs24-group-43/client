import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/views/ClientSettings.scss";



const ClientSettings = ({ isOpen, onClose, hotkeyInputDraw, setHotkeyInputDraw, hotkeyInputFill, setHotkeyInputFill, hotkeyInputEraser, setHotkeyInputEraser, hotkeyInputClear, setHotkeyInputClear }) => {
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
        <h3>Change Hotkeys</h3>
        <div className="hotkeys">
          
          <input
            type="text"
            value={hotkeyInputDraw}
            maxLength={1}
            onChange={(e) => setHotkeyInputDraw(e.target.value.toUpperCase())}
            
          />
          <label className="hotkey label">Draw    </label>
        
            <input
              type="text"
              value={hotkeyInputFill}
              maxLength={1}
              onChange={(e) => setHotkeyInputFill(e.target.value.toUpperCase())}
            />
            <label className="hotkey label">Fill</label>
          </div>
          <div className="hotkeys">
          <input
            type="text"
            value={hotkeyInputEraser}
            maxLength={1}
            onChange={(e) => setHotkeyInputEraser(e.target.value.toUpperCase())}
            
          />
          <label className="hotkey label">Eraser</label>
       
            <input
              type="text"
              value={hotkeyInputClear}
              maxLength={1}
              onChange={(e) => setHotkeyInputClear(e.target.value.toUpperCase())}
            />
           <label className="hotkey label">Clear</label>
        </div>
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
  hotkeyInputDraw: PropTypes.string.isRequired,
  setHotkeyInputDraw: PropTypes.func.isRequired,
  hotkeyInputFill: PropTypes.string.isRequired,
  setHotkeyInputFill: PropTypes.func.isRequired,
  hotkeyInputEraser: PropTypes.string.isRequired,
  setHotkeyInputEraser: PropTypes.func.isRequired,
  hotkeyInputClear: PropTypes.string.isRequired,
  setHotkeyInputClear: PropTypes.func.isRequired,
};

export default ClientSettings;