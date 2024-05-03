import React, { useEffect, useState } from "react";
import "../../styles/views/lobby/Lobby.scss"

import Players from "components/elements/lobby/Players";
import Settings from "components/elements/lobby/Settings";

import { stompApi } from "./LandingPage";

const Lobby = () => {
  useEffect(() => {
    stompApi.subscribe("/topic/coordinates", onMessageReceived);

    return () => {
    };
  }, []);

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log("PayLoad Lobby:", payloadData);
  };


  return (
    <div className="Lobby container">
      <Players/>
      <Settings/>
    </div>
  );
};
  
export default Lobby;
