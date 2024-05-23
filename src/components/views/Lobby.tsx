import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/lobby/Lobby.scss"
import Chat from "./Chat";
import { useCurrentPath } from '../routing/routers/LocationContext.js'; 


import Players from "components/elements/lobby/Players";
import Settings from "components/elements/lobby/Settings";
import StartGame from "components/elements/lobby/StartGame";
//import { Context } from "../../context/Context";

// import { stompApi } from "./LandingPage";

const Lobby = () => {
  let rawUserData = useLocation()["state"];
  const [isChatting, setIsChatting] = useState(true);
  const [isGenreSelectionValid, setIsGenreSelectionValid] = useState(true);
  const { updateCurrentPath } = useCurrentPath();

  console.log("this is useLocation in Lobby: " + JSON.stringify(rawUserData));

  useEffect(() => {
    updateCurrentPath("lobby");
  }, [updateCurrentPath]);

  return (
    <div className="Lobby container">
      <Players />
      <div className="Lobby form">
        <Settings setIsGenreSelectionValid={setIsGenreSelectionValid} />
        <StartGame isGenreSelectionValid={isGenreSelectionValid} />
      </div>
      <Chat isChatting={isChatting} setIsChatting={setIsChatting} />
    </div>
  );
};

export default Lobby;