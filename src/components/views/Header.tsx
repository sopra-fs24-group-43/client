import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLogo } from '../ui/ReactLogo';
import PropTypes from 'prop-types';
import ClientSettings from './ClientSettings';
import FriendsPopover from './FriendsPopover';
import GlobalLeaderboard from './GlobalLeaderboard';
import '../../styles/views/Header.scss';

const Header = (props) => {
  const [isClientSettingsOpen, setIsClientSettingsOpen] = useState(false);
  const [hotkeyInputDraw, setHotkeyInputDraw] = useState<string>("D");
  const [hotkeyInputFill, setHotkeyInputFill] = useState<string>("F");
  const [hotkeyInputEraser, setHotkeyInputEraser] = useState<string>("E");
  const [hotkeyInputClear, setHotkeyInputClear] = useState<string>("C");
  // const [isGamePath, setIsGamePath] = useState(false);
  // const location = useLocation();


  const handleClientSettingsClick = () => {
    setIsClientSettingsOpen(true);
  };

  function refreshPage() {
    window.location.reload();
  }

  const handleCloseClientSettings = () => {
    setIsClientSettingsOpen(false);
    //refreshPage();
  };


  // getting the link of current page
  // const isGamePath = location.pathname.startsWith("/game");
  // useEffect (() => {
  //   if (location.pathname.startsWith("/game")){
  //     setIsGamePath(true)
  //   } else {
  //     setIsGamePath(false)
  //   }
  // }, [])

  return (
    <div className={`header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
      <div className={"header title"}>
        <a href="/landingpage">
          <img src="/logo18.png" alt="Logo" className="header logo" />
        </a>
      </div>
      {true && (

        <div className={`header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} navigation`}>
                    <GlobalLeaderboard
            trigger={
              <div className="navigation-link">
                <img src="/leaderboard.png" alt="Leaderboard Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
              </div>
            }
          />
          

          {/* {parseInt(sessionStorage.getItem("userId"))>0 && (

          )} */}
          <FriendsPopover
            trigger={
              <div className="navigation-link">
                <img src="/friends.png" alt="Friends Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
              </div>
            }
          />

          <button onClick={handleClientSettingsClick} className="navigation-link settings-button">
            <img src="/settings.png" alt="ClientSettings Icon" className="header img" />
          </button>
          <a href="/profile/${user.id}" className="navigation-link">
            <img src="/profile.png" alt="Profile Icon" className="header img" />
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
