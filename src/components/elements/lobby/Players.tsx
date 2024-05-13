import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/views/lobby/Players.scss"

import { Context } from "../../../context/Context";

const Players = () => {
  // not needed handleBeforeUnload

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // getting contex
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  // websocket connection establishing
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };

  const connect = async ()=>{
    await stompApi.connect(() => {
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Players");
      console.log("subscribed when was NOT connected to the websocket in Players");
      stompApi.connected = true;
    });
    await timeout(1000);
  };

  useEffect(() => {
    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Players");
      console.log("subscribed when was connected to the websocket in Players");
    };

    // if not connected
    if (!stompApi.isConnected()){
      console.log("connecting to ws in Players view");
      connect();
      // stompApi.send(`/app/games/${lobbyId}/getlobbyinfo`, JSON.stringify(lobbyId));
      console.log("connected");

      console.log("sending data from the Players");
      sendData();
    };

    if (stompApi.isConnected()){
      sendData();
    };
 
    // cleaning up
    return () => {  //this gets executed when navigating another page
      if (localStorage.getItem("role") === "admin"){
        deleteLobby();
      }
      if (localStorage.getItem("role") === "player"){
        leaveLobby();
      }
      // unsub
      console.log("unsubscribing and cleaning up when navigating to different view from Players!");
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Players");
    };
  }, [stompApi.isConnected()]); // [stompApi.isConnected()]

  const sendData = async () => { // needed for delaying the send function, so the connection is established
    await timeout(1100); // !!!!! needs a little bit more time!
    console.log("sending the message from the Players");
    stompApi.send(`/app/games/${lobbyId}/getlobbyinfo`, "");
  };

  // create lists to track players in the lobby
  const [players, setPlayers] = useState({}); // before <{[key: string]: any}>
  const [renderedPlayers, setRenderedPlayers] = useState([]);
  const [lobbyName, setLobbyName] = useState([]);

  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body);
    if (responseData.type === "getlobbyinfo") {
      // setting the lobby's name
      setLobbyName(responseData.gameSettingsDTO.lobbyName);
      console.log("lobbyName: ", responseData.gameSettingsDTO.lobbyName);

      const newPlayersData = responseData.players;

      // Combine the new player data with the existing player list
      const updatedPlayers = { ...players, ...newPlayersData };

      // Convert the updated player list to an array of player components
      const playersArray = Object.values(updatedPlayers).map(player => (
        <div key={player["userId"]} className="Players form">
          <div className="Players avatar">
            <img src="/painter.png" alt="Avatar" className="Players avatar"/>
          </div>
          <div className="Players player">
            <div className="Players username">
              {player["username"]}
            </div>
            <div className="Players points">
              {player["newlyEarnedPoints"]} points
            </div>
          </div>
        </div>
      ));
      setPlayers(updatedPlayers);
      setRenderedPlayers(playersArray); // Set the array of player components in the state
    }
  };

  // deleting the lobby if you the creator
  const deleteLobby = () => {
    stompApi.send(`/app/games/${lobbyId}/leavegame`, "");
  }

  // leaving from the lobby if you are a player
  const leaveLobby = () => {
    stompApi.send(`/app/games/${lobbyId}/leavegame`, JSON.stringify({gameId: lobbyId, indoundPlayer: "indoundPlayer"}));
  }

  return (
    <div className="Players container">
      <div className="Players header">
        {lobbyName}
      </div>
      {renderedPlayers}
    </div>
  );
};

export default Players;