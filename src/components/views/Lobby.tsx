import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/lobby/Lobby.scss"

import Players from "components/elements/lobby/Players";
import Settings from "components/elements/lobby/Settings";

// import { stompApi } from "./LandingPage";

const Lobby = () => {
  let rawUserData = useLocation()["state"];
  console.log("this is useLocation in Lobby: " + JSON.stringify(rawUserData));
  const navigate = useNavigate();
  //userData={userData}
  return (
    <div className="Lobby container">
      <Players/>
      <div className="Lobby form">
        <Settings/>
        <Button
          width="100%"
          onClick={() => navigate("/game")}
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};
  
export default Lobby;
