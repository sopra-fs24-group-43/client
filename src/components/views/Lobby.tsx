import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/lobby/Lobby.scss"

import Players from "components/elements/lobby/Players";
import Settings from "components/elements/lobby/Settings";

// import { stompApi } from "./LandingPage";

const Lobby = () => {
  // useEffect(() => {
  //   stompApi.subscribe("/topic/coordinates", onMessageReceived);

  //   return () => {
  //   };
  // }, []);

  // const onMessageReceived = (payload) => {
  //   var payloadData = JSON.parse(payload.body);
  //   console.log("PayLoad Lobby:", payloadData);
  // };
  let a = useLocation()["state"];
  console.log("this is useLocation in Lobby: " + JSON.stringify(a));
  const navigate = useNavigate();

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
