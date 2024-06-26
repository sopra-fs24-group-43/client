import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactLogo } from '../ui/ReactLogo';
import PropTypes from 'prop-types';
import ClientSettings from './ClientSettings';
import FriendsPopover from './FriendsPopover';
import GlobalLeaderboard from './GlobalLeaderboard';
import { useCurrentPath } from '../routing/routers/LocationContext';
import '../../styles/views/Header.scss';
import logoPic from './logo18.png';
import logoPic2 from './friends.png';
import logoPic3 from './profile.png';
import logoPic4 from './leaderboard.png';
import logoPic5 from './settings.png';


const Header = (props) => {
  const [isClientSettingsOpen, setIsClientSettingsOpen] = useState(false);
  const [enableProfile, setEnableProfile] = useState(true);
  const [enableLeaderboard, setEnableLeaderboard] = useState(true); 
  const [hotkeyInputDraw, setHotkeyInputDraw] = useState<string>("D");
  const [hotkeyInputFill, setHotkeyInputFill] = useState<string>("F");
  const [hotkeyInputEraser, setHotkeyInputEraser] = useState<string>("E");
  const [hotkeyInputClear, setHotkeyInputClear] = useState<string>("C");
  const [userId, setUserId] = useState<string>("");
 

  const { currentPath } = useCurrentPath();

  useEffect(() => {
    if (currentPath) {
      setUserId(sessionStorage.getItem("userId"));
      if (currentPath.includes("lobby") || currentPath.includes("game")) {
        setEnableProfile(false);
        setEnableLeaderboard(false); 
      } else {
        setEnableProfile(true);
        setEnableLeaderboard(true); 
      }
    }
  }, [currentPath]);

  function refreshPage() {
    window.location.reload();
  }

  const handleClientSettingsClick = () => {
    setIsClientSettingsOpen(true);
  };

  const handleCloseClientSettings = () => {
    setIsClientSettingsOpen(false);
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
        <a href="/LandingPage" className="header a">
          <img src={logoPic} alt="Logo" className="header logo" />
        </a>
      </div>
      <div className={`header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} navigation`}>
        
        {enableLeaderboard && ( 
          <a href="/GlobalLeaderboard" className="navigation-link">
          <img src={logoPic4} alt="Leaderboard Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
        </a>
        )}
        {parseInt(sessionStorage.getItem("userId")) > 0 && (
          <FriendsPopover
            trigger={
              <div className="navigation-link">
                <img src={logoPic2} alt="Friends Icon" className={`header${localStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
              </div>
            }
          />
        )}
        <button onClick={handleClientSettingsClick} className="navigation-link settings-button">
          <img src={logoPic5} alt="ClientSettings Icon" className="header img" />
        </button>

        {parseInt(sessionStorage.getItem("userId")) > 0 && enableProfile && (
          <a href={`/profile/${userId}`} className="navigation-link">
            <img src={logoPic3} alt="Profile Icon" className="header img" />
          </a>
        )}
      </div>
      <ClientSettings isOpen={isClientSettingsOpen} onClose={handleCloseClientSettings} />
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
