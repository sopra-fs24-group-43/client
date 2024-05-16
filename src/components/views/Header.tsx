import React, { useState } from 'react';
import { ReactLogo } from '../ui/ReactLogo';
import PropTypes from 'prop-types';
import Settings from './Settings';
import '../../styles/views/Header.scss';

const Header = (props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };
  function refreshPage() {
    window.location.reload();
  }

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
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
        <button onClick={handleSettingsClick} className="navigation-link settings-button">
          <img src="/settings.png" alt="Settings Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </button>
        <a href="/profile" className="navigation-link">
          <img src="/profile.png" alt="Profile Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </a>
      </div>

      <Settings isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
