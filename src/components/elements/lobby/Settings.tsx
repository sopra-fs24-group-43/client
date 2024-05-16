import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/views/lobby/Settings.scss"

import { Context } from "../../../context/Context";

const Settings = () => {
  console.log("I'm in the Settings");
  // setting up the gameSettings
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [maxRounds, setMaxRounds] = useState(5);
  const [turnLength, setTurnLength] = useState(60); // seconds

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);
  
  // getting contex
  const context = useContext(Context)
  const {stompApi} = context  //or const stompApi = context.stompApi

  // websocket connection establishing
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };

  // subscribe if !stompApi.isConnected()
  const subscribe = async () => { // needed for delaying the send function, so the connection is established
    await timeout(600);
    console.log("Subscribing from the settings");
    stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Settings");
  };
  
  useEffect(() => {
    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Settings");
      console.log("subscribed when was connected to the websocket in Settings");
    } else if (!stompApi.isConnected()){
      subscribe()
    }
    
    // unsub
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from Settings!");
      // window.removeEventListener('beforeunload', handleBeforeUnload)
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Settings");
    };
  }, []);

  useEffect(() => {
    // sending the data to the server only if user is a creator of a lobby
    if (sessionStorage.getItem("role") === "admin"){
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

  }, [maxPlayers, maxRounds, turnLength]) 

  const sendData = async (settings) => { // needed for delaying the send function, so the connection is established
    await timeout(400);
    console.log("sending the message from the settings");
    stompApi.send(`/app/games/${lobbyId}/updategamesettings`, JSON.stringify(settings));
  };

  // handling the response
  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body); // response data from the server
    console.log("Settings' payload: ", responseData);
    if (responseData.type === "gameSettings"){
      setMaxPlayers(responseData.maxPlayers);
      setMaxRounds(responseData.maxRounds);
      setTurnLength(responseData.turnLength);
    } else if (responseData.type === "getlobbyinfo") {
      setMaxPlayers(responseData.gameSettingsDTO.maxPlayers);
      setMaxRounds(responseData.gameSettingsDTO.maxRounds);
      setTurnLength(responseData.gameSettingsDTO.turnLength);
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

  // disabling the select element if user is not the creator of a lobby ("admin")
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") {
      const selects = document.querySelectorAll(".Settings.slide-down-menu");
      selects.forEach((select) => {
        (select as HTMLSelectElement).disabled = true;
      });
    }
  }, []);

  return (
    <div className={`Settings${localStorage.getItem("isDarkMode") ? '_dark' : ''} container`}>
      <div className="Settings menu-form">
        <div className={`Settings${localStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Players</div>
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
        <div className={`Settings${localStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Rounds</div>
        <select className="Settings slide-down-menu" name="maxRounds" value={maxRounds} onChange={handleSettingsChange}>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className={`Settings${localStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Drawtime</div>
        <select className="Settings slide-down-menu" name="turnLength" value={turnLength}
                onChange={handleSettingsChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
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
