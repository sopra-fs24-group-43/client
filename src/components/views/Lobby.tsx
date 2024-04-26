import React, { useEffect, useState } from "react";
import "../../styles/views/Lobby.scss"

import {stompApi} from "./LandingPage";


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
      <h1>Lobby..</h1>
    </div>
  );
};
  
export default Lobby;
