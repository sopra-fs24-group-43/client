import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../../styles/views/lobby/Players.scss"

import { Context } from "../../../context/Context";

const Players = () => {
  // not needed handleBeforeUnload
  const navigate = useNavigate();

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // checking if a user is a creator of a lobby
  const [isAdmin, setIsAdmin] = useState(false);


  // checking if a user is a creator of a lobby 
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  // getting contex
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  // websocket connection establishing
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };

  const connect = async ()=>{
    await stompApi.connect(() => {
      const userId = sessionStorage.getItem("userId");
      console.log("subscribed when was NOT connected to the websocket in Players");
      stompApi.connected = true;
    });
    await timeout(1000);
  };

  useEffect(() => {
    //reload hadling
    /*
    const handleBeforeUnload = (event) => {  //this gets executed when reloading the page, was commented
      console.log("disconnecting before reloading page!")
      stompApi.disconnect()
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

     */
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
    if (responseData.type === "deletegame") {
      navigate("/LandingPage");
    }
  };

  // deleting the lobby if you the creator
  const deleteLobby = async () => {
    stompApi.send(`/app/games/${lobbyId}/deletegame`, JSON.stringify(lobbyId));
  }

  // leaving from the lobby if you are a player
  const leaveLobby = async () => {
    stompApi.send(`/app/games/${lobbyId}/leavegame/${sessionStorage.getItem("userId")}`, "");
    navigate("/LandingPage");
  }

  return (
    <div className="Players container">
      <div className="Players players">
        <div className="Players header">
          {lobbyName}
        </div>
        {renderedPlayers}
      </div>
      {!isAdmin && (
        <Button
          width="100%"
          onClick={leaveLobby}
        >
          Leave game
        </Button>
      )}
      {isAdmin && (
        <Button
          width="100%"
          onClick={deleteLobby}
        >
          Delete game
        </Button>
      )}
    </div>
  );
};

export default Players;