import React, { useEffect, useState } from "react";
import "../../../styles/views/lobby/Settings.scss"

import { stompApi } from "../../views/LandingPage";

const LobbySettings = () => {
  useEffect(() => {
    stompApi.subscribe("/topic/coordinates", onMessageReceived);

    return () => {
    };
  }, []);

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log("PayLoad Lobby:", payloadData);
  };

  const [maxPlayers, setMaxPlayers] = useState(5);
  const [maxRounds, setMaxRounds] = useState(5);
  const [turnLength, setTurnLength] = useState(60); // seconds

  const handleMaxPlayersChange = (event) => {
    setMaxPlayers(parseInt(event.target.value));
  };

  const handleMaxRoundsChange = (event) => {
    setMaxRounds(parseInt(event.target.value));
  };

  const handleTurnLengthChange = (event) => {
    setTurnLength(parseInt(event.target.value));
  };

  return (
    <div className="Settings container">
      <div className="Settings menu-form">
        <div className="Settings menu-label">Players</div>
        <select className="Settings slide-down-menu" value={maxPlayers} onChange={handleMaxPlayersChange}>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className="Settings menu-label">Rounds</div>
        <select className="Settings slide-down-menu" value={maxRounds} onChange={handleMaxRoundsChange}>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className="Settings menu-label">Drawtime</div>
        <select className="Settings slide-down-menu" value={turnLength} onChange={handleTurnLengthChange}>
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>60</option>
          <option value={80}>80</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};
  
export default LobbySettings;
