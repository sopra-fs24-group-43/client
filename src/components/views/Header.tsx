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

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="header container">
      <div className="header title">
        <h1 className="header logo">Freitagsmaler - Group 43</h1>
        <ReactLogo />
      </div>
      <div className="header navigation">
        <a href="/leaderboard" className="navigation-link">
          <img src="/leaderboard.png" alt="Leaderboard Icon" className="header img" />
        </a>
        <a href="/friends" className="navigation-link">
          <img src="/friends.png" alt="Friends Icon" className="header img" />
        </a>
        <button onClick={handleSettingsClick} className="navigation-link settings-button">
          <img src="/settings.png" alt="Settings Icon" className="header img" />
        </button>
        <a href="/profile" className="navigation-link">
          <img src="/profile.png" alt="Profile Icon" className="header img" />
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
