import React, { useState } from 'react';
import { ReactLogo } from '../ui/ReactLogo';
import PropTypes from 'prop-types';
import ClientSettings from './ClientSettings';
import '../../styles/views/Header.scss';

const Header = (props) => {
  const [isClientSettingsOpen, setIsClientSettingsOpen] = useState(false);

  const handleClientSettingsClick = () => {
    setIsClientSettingsOpen(true);
  };
  function refreshPage() {
    window.location.reload();
  }

  const handleCloseClientSettings = () => {
    setIsClientSettingsOpen(false);
    refreshPage();
  };

  return (
    <div className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
      <div className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} title`}>
        <h1 className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} logo`}>Freitagsmaler - Group 43</h1>
        <ReactLogo />
      </div>
      <div className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} navigation`}>
        <a href="/leaderboard" className="navigation-link">
          <img src="/leaderboard.png" alt="Leaderboard Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </a>
        <a href="/friends" className="navigation-link">
          <img src="/friends.png" alt="Friends Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </a>
        <button onClick={handleClientSettingsClick} className="navigation-link settings-button">
          <img src="/settings.png" alt="ClientSettings Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </button>
        <a href="/profile" className="navigation-link">
          <img src="/profile.png" alt="Profile Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </a>
      </div>

      <ClientSettings isOpen={isClientSettingsOpen} onClose={handleCloseClientSettings} />
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
