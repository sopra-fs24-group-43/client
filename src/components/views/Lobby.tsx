import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/lobby/Lobby.scss"
import Chat from "./Chat";


import Players from "components/elements/lobby/Players";
import Settings from "components/elements/lobby/Settings";
import StartGame from "components/elements/lobby/StartGame";

const Lobby = () => {
  let rawUserData = useLocation()["state"];
  const [isChatting, setIsChatting] = useState(true);
  console.log("this is useLocation in Lobby: " + JSON.stringify(rawUserData));
  const [isGenreSelectionValid, setIsGenreSelectionValid] = useState(true)

  useEffect (() => {
    // adding location to the session storage
    sessionStorage.setItem("location", "lobby");
  }, [])
  
  return (
    <div className="Lobby container">
      <Players/>
      <div className="Lobby form">
        <Settings setIsGenreSelectionValid={setIsGenreSelectionValid} />
        <StartGame isGenreSelectionValid={isGenreSelectionValid} />
      </div>
      <Chat isChatting={isChatting} setIsChatting={setIsChatting} />
    </div>
  );
};
  
export default Lobby;
