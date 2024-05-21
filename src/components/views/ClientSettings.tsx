import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "../../styles/views/ClientSettings.scss";
import { api, handleError } from "helpers/api";
import debounce from "lodash.debounce";

const ClientSettings = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(sessionStorage.getItem("isDarkMode") || false);
  const [hotkeyInputDraw, setHotkeyInputDraw] = useState(sessionStorage.getItem("hotkeyInputDraw") || "D");
  const [hotkeyInputFill, setHotkeyInputFill] = useState(sessionStorage.getItem("hotkeyInputFill") || "F");
  const [hotkeyInputEraser, setHotkeyInputEraser] = useState(sessionStorage.getItem("hotkeyInputEraser") || "E");
  const [hotkeyInputClear, setHotkeyInputClear] = useState(sessionStorage.getItem("hotkeyInputClear") || "C");
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleDarkMode = () => {
    if(sessionStorage.getItem("isDarkMode")) {setIsDarkMode(true);}
    if(!isDarkMode) {sessionStorage.setItem("isDarkMode","_dark");}
    else {sessionStorage.setItem("isDarkMode","");}
    setIsDarkMode(!isDarkMode);

  };

  const doHotkeys = useCallback(
    debounce(async () => {
      const requestBody = {
        hotkeyInputDraw,
        hotkeyInputFill,
        hotkeyInputEraser,
        hotkeyInputClear,
      };
      try {
        await api.put(`/users/${sessionStorage.getItem("userId")}`, requestBody);
      } catch (error) {
        handleError(error);
      }
    }, 300),
    [hotkeyInputDraw, hotkeyInputFill, hotkeyInputEraser, hotkeyInputClear]
  );

  useEffect(() => {
    doHotkeys();
    return () => {
      doHotkeys.cancel();
    };
  }, [hotkeyInputDraw, hotkeyInputFill, hotkeyInputEraser, hotkeyInputClear, doHotkeys]);

  useEffect(() => {
    if (isOpen) {
      setHotkeyInputDraw(sessionStorage.getItem("hotkeyInputDraw") || "D");
      setHotkeyInputFill(sessionStorage.getItem("hotkeyInputFill") || "F");
      setHotkeyInputEraser(sessionStorage.getItem("hotkeyInputEraser") || "E");
      setHotkeyInputClear(sessionStorage.getItem("hotkeyInputClear") || "C");
      setIsDarkMode(sessionStorage.getItem("isDarkMode") || false);
    }
  }, [isOpen]);

  const handleChange = (setter, key, newValue) => {
    newValue = newValue.toUpperCase();
    if (
      newValue === hotkeyInputDraw ||
      newValue === hotkeyInputFill ||
      newValue === hotkeyInputEraser ||
      newValue === hotkeyInputClear
    ) {
      setErrorMessage("Each hotkey must be unique.");
      return;
    }
    setErrorMessage("");
    setter(newValue);
    sessionStorage.setItem(key, newValue);
  };

  if (!isOpen) return null;

  return (
    <div className={`client-settings ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Settings</h2>
        <h3>Change Hotkeys</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="hotkeys">
          <input
            type="text"
            value={hotkeyInputDraw}
            maxLength={1}
            onChange={(e) => handleChange(setHotkeyInputDraw, "hotkeyInputDraw", e.target.value)}
          />
          <label className="hotkey-label">Draw</label>
          <input
            type="text"
            value={hotkeyInputFill}
            maxLength={1}
            onChange={(e) => handleChange(setHotkeyInputFill, "hotkeyInputFill", e.target.value)}
          />
          <label className="hotkey-label">Fill</label>
        </div>
        <div className="hotkeys">
          <input
            type="text"
            value={hotkeyInputEraser}
            maxLength={1}
            onChange={(e) => handleChange(setHotkeyInputEraser, "hotkeyInputEraser", e.target.value)}
          />
          <label className="hotkey-label">Eraser</label>
          <input
            type="text"
            value={hotkeyInputClear}
            maxLength={1}
            onChange={(e) => handleChange(setHotkeyInputClear, "hotkeyInputClear", e.target.value)}
          />
          <label className="hotkey-label">Clear</label>
        </div>
        <div className="setting-option">
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
