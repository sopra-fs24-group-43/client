import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLogo } from '../ui/ReactLogo';
import PropTypes from 'prop-types';
import ClientSettings from './ClientSettings';
import '../../styles/views/Header.scss';

const Header = (props) => {
  const [isClientSettingsOpen, setIsClientSettingsOpen] = useState(false);

  const handleClientSettingsClick = () => {
    setIsClientSettingsOpen(true);
  };

  const handleCloseClientSettings = () => {
    setIsClientSettingsOpen(false);
  };

  // getting the link of current page
  const isGamePath = location.pathname.startsWith('/game');

  return (
    <div className="header container">
      <div className="header title">
        <h1 className="header logo">Freitagsmaler - Group 43</h1>
        <ReactLogo />
      </div>
      {!isGamePath && (
        <div className="header navigation">
          <a href="/leaderboard" className="navigation-link">
            <img src="/leaderboard.png" alt="Leaderboard Icon" className="header img" />
          </a>
          <a href="/friends" className="navigation-link">
            <img src="/friends.png" alt="Friends Icon" className="header img" />
          </a>
          <button onClick={handleClientSettingsClick} className="navigation-link settings-button">
            <img src="/settings.png" alt="Settings Icon" className="header img" />
          </button>
          <a href="/profile" className="navigation-link">
            <img src="/profile.png" alt="Profile Icon" className="header img" />
          </a>
        </div>
      )}
      <ClientSettings isOpen={isClientSettingsOpen} onClose={handleCloseClientSettings} />
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
