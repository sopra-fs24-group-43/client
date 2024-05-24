import React, { useState, useRef, useEffect, useContext } from "react";
import { Button } from "./Button";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/ui/InvitePopover.scss"

import { Context } from "../../context/Context";


const InvitePopover = ({ gameId, friendUserId }) => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const {stompApi} = context; 

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 35000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeny = () => {
    setIsVisible(false);
  };

  const inboundPlayer = {
    type: "inboundPlayer",
    username: sessionStorage.getItem("username"),
    userId: sessionStorage.getItem("userId"),
    isGuest: sessionStorage.getItem("isGuest"),
    gameId: gameId,
    friends: [],
    role: "player"
  }

  const joinLobby = () => {
    console.log("/app/games/" + gameId + "/joingame")
    stompApi.send("/app/games/" + gameId + "/joingame", JSON.stringify(inboundPlayer))
    console.log("joinLobby...")
    // stompApi.disconnect();
    console.log(`navigating to /lobby/${gameId}`)
    sessionStorage.setItem("role", "player");
    sessionStorage.setItem("gameId", gameId);
    navigate(`/lobby/${gameId}`,{state: {username: inboundPlayer.username, userId: inboundPlayer.userId, friends: inboundPlayer.friends, gameId: inboundPlayer.gameId, role: inboundPlayer.role}})
    setIsVisible(false);
  };

  return (
    <React.Fragment>
      {isVisible &&(
        <div className="InvitePopover popover-container">
          <div className="InvitePopover popover-content">
            <div className="InvitePopover title">
              You have invited you to the lobby {gameId}
            </div>
            <div className="InvitePopover buttons">
              <Button className="InvitePopover accept-button" onClick={joinLobby}>
                Accept
              </Button>
              <Button className="InvitePopover deny-button" onClick={handleDeny}>
                Deny
              </Button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default InvitePopover;