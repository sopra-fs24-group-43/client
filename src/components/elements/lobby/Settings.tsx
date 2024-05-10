import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/views/lobby/Settings.scss"

import { stompApi } from "../../views/LandingPage";

const Settings = () => {
  // setting up the gameSettings
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [maxRounds, setMaxRounds] = useState(5);
  const [turnLength, setTurnLength] = useState(60); // seconds

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // websocket connection establishing
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };

  const connect = async ()=>{
    stompApi.connect();
    await timeout(1000);
    stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse);
  };

  useEffect(() => {
    // connecting
    if (!stompApi.isConnected()){
      console.log("connecting to ws in Lobby view");
      connect();
      console.log("connected");
    }

    // sending the data to the server only if user is a creator of a lobby
    if (localStorage.getItem("role") === "admin"){
        const settings = {
        type: "gameSettings",
        maxPlayers: maxPlayers,
        maxRounds: maxRounds,
        turnLength: turnLength
      };
      if (stompApi.isConnected()){
        sendData(settings);
      };
    };
  }, );

  const sendData = async (settings) => { // needed for delaying the send function, so the connection is established
    await timeout(1000);
    stompApi.send(`/app/games/${lobbyId}/updategamesettings`, JSON.stringify(settings));
  };

  // sending the data to the server
  useEffect(() => {
    if (localStorage.getItem("role") === "admin"){
      const settings = {
        type: "gameSettings",
        maxPlayers: maxPlayers,
        maxRounds: maxRounds,
        turnLength: turnLength
      };
      if (stompApi.isConnected()){
        sendData(settings);
      };
    };
  }, [maxPlayers, maxRounds, turnLength]);

  // fetching the data
  // useEffect(() => {
  //   const fetchInitialSettings = async () => {
  //     // Fetch initial settings from the server
  //     const response = await fetch(`/topic/games/${lobbyId}/general`);
  //     const initialSettings = await JSON.parse;
      
  //     // Update state with initial settings
  //     setMaxPlayers(initialSettings.maxPlayers);
  //     setMaxRounds(initialSettings.maxRounds);
  //     setTurnLength(initialSettings.turnLength);
  //   };
  
  //   fetchInitialSettings();
  // }, []);

  // handling the response
  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body); // response data from the server
    console.log("payload: ", responseData);
    if (responseData.type === "gameSettings"){
      setMaxPlayers(responseData.maxPlayers);
      setMaxRounds(responseData.maxRounds);
      setTurnLength(responseData.turnLength);
    }
  };

  // handling the changes of the settings on the page
  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    console.log("event: ", event, "name: ", name, "value: ", value);

    switch (name) {
      case "maxPlayers":
        setMaxPlayers(parseInt(value));
        break;
      case "maxRounds":
        setMaxRounds(parseInt(value));
        break;
      case "turnLength":
        setTurnLength(parseInt(value));
        break;
      default:
        break;
    };
  };

  return (
    <div className="Settings container">
      <div className="Settings menu-form">
        <div className="Settings menu-label">Players</div>
        <select className="Settings slide-down-menu" name="maxPlayers" value={maxPlayers} onChange={handleSettingsChange}>
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
        <select className="Settings slide-down-menu" name="maxRounds" value={maxRounds} onChange={handleSettingsChange}>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className="Settings menu-label">Drawtime</div>
        <select className="Settings slide-down-menu" name="turnLength" value={turnLength} onChange={handleSettingsChange}>
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

export default Settings;
