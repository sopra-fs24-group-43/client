import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/game/LeaderboardInGame.scss"
import logoPic3 from './painter.png';

import { Context } from "../../context/Context";

const LeaderboardInGame = () => {
  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // getting contex
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  useEffect(() => {
    // adding location to the session storage
    sessionStorage.setItem("location", "leaderboard");
    
    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "LeaderboardInGame");
      console.log("subscribed when was connected to the websocket in LeaderboardInGame");
      
      // sending the data
      stompApi.send(`/app/games/${lobbyId}/getleaderboard`, "");
    };

    // cleaning up
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from LeaderboardInGame!");
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "LeaderboardInGame");
    };
  }, [stompApi.isConnected()]); // [stompApi.isConnected()]

  // create lists to track players in the lobby
  const [players, setPlayers] = useState({}); // before <{[key: string]: any}>
  const [renderedPlayers, setRenderedPlayers] = useState([]);

  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body);
    if (responseData.type === "leaderboard" || responseData.type === "leaderboard2") {

      const newPlayersData = responseData.userIdToPlayer;

      // combine the new player data with the existing player list
      const updatedPlayers = { ...players, ...newPlayersData };

      // convert the updated player list to an array of player components
      const playersArray = Object.values(updatedPlayers).map(player => (
        <div key={player["userId"]} className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} form`}>
          <div className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} avatar`}>
            <img src={logoPic3} alt="Avatar" className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} avatar`}/>
          </div>
          <div className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} player`}>
            <div className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} username`}>
              {player["username"]} {sessionStorage.getItem("username") === player["username"] && " (You)"}

            </div>
            <div className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} points`}>
              {player["totalPoints"]} points
            </div>
          </div>
        </div>
      ));
      setPlayers(updatedPlayers);
      setRenderedPlayers(playersArray);
    }
  };

  return (
    <div className={`LeaderboardInGame${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} players`}>
      {renderedPlayers}
    </div>
  );
};

export default LeaderboardInGame;