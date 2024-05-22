import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLogo } from '../ui/ReactLogo';
import PropTypes from 'prop-types';
import ClientSettings from './ClientSettings';
import '../../styles/views/Header.scss';

const Header = (props) => {
  const [isClientSettingsOpen, setIsClientSettingsOpen] = useState(false);
  const [hotkeyInputDraw, setHotkeyInputDraw] = useState<string>("D");
  const [hotkeyInputFill, setHotkeyInputFill] = useState<string>("F");
  const [hotkeyInputEraser, setHotkeyInputEraser] = useState<string>("E");
  const [hotkeyInputClear, setHotkeyInputClear] = useState<string>("C");

  const handleClientSettingsClick = () => {
    setIsClientSettingsOpen(true);
  };

  function refreshPage() {
    window.location.reload();
  }

  const handleCloseClientSettings = () => {
    setIsClientSettingsOpen(false);
    
  };

  // getting the link of current page
  const isGamePath = location.pathname.startsWith("/game");

  return (
    <div className={`header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
      <div className={`header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} title`}>
        <img src="/logo12.png" alt="Logo" className="header logo" /> 
        
      </div>
      {!isGamePath && (
        <div className={`header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} navigation`}>
          <a href="/leaderboard" className="navigation-link">
            <img src="/leaderboard.png" alt="Leaderboard Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
          </a>
          <a href="/friends" className="navigation-link">
            <img src="/friends.png" alt="Friends Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
          </a>
          <button onClick={handleClientSettingsClick} className="navigation-link settings-button">
            <img src="/settings.png" alt="ClientSettings Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
          </button>
          <a href="/profile/${user.id}" className="navigation-link">
            <img src="/profile.png" alt="Profile Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
          </a>
        </div>
      )}
      <ClientSettings isOpen={isClientSettingsOpen} onClose={handleCloseClientSettings}/>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
