import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/game/LeaderboardInGame.scss"

import { Context } from "../../context/Context";

const LeaderboardInGame = () => {
  const navigate = useNavigate();

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // getting contex
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  // websocket connection establishing
  // function timeout(delay: number) {
  //   return new Promise( res => setTimeout(res, delay) );
  // };

  // const connect = async ()=>{
  //   await stompApi.connect(() => {
  //     stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "LeaderboardInGame");
  //     console.log("subscribed when was NOT connected to the websocket in LeaderboardInGame");
  //     stompApi.connected = true;
  //   });
  //   await timeout(1000);
  // };

  useEffect(() => {
    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "LeaderboardInGame");
      console.log("subscribed when was connected to the websocket in LeaderboardInGame");
      
      // sending the data
      //stompApi.send(`/app/games/${lobbyId}/endturn`, "");
    };

    // if not connected
    // if (!stompApi.isConnected()){
    //   console.log("connecting to ws in LeaderboardInGame view");
    //   connect();
    //   // stompApi.send(`/app/games/${lobbyId}/getlobbyinfo`, JSON.stringify(lobbyId));
    //   console.log("connected");

    //   console.log("sending data from the LeaderboardInGame");
    //   sendData();
    // };

    // if (stompApi.isConnected()){
    //   sendData();
    // };
 
    // cleaning up
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from LeaderboardInGame!");
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "LeaderboardInGame");
    };
  }, [stompApi.isConnected()]); // [stompApi.isConnected()]

  // const sendData = async () => { // needed for delaying the send function, so the connection is established
  //   await timeout(1100); // !!!!! needs a little bit more time!
  //   console.log("sending the message from the LeaderboardInGame");
  //   stompApi.send(`/app/games/${lobbyId}/getlobbyinfo`, "");
  // };

  // create lists to track players in the lobby
  const [players, setPlayers] = useState({}); // before <{[key: string]: any}>
  const [renderedPlayers, setRenderedPlayers] = useState([]);

  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body);
    if (responseData.type === "leaderboard") {

      const newPlayersData = responseData.userIdToPlayer;

      // Combine the new player data with the existing player list
      const updatedPlayers = { ...players, ...newPlayersData };

      // Convert the updated player list to an array of player components
      const playersArray = Object.values(updatedPlayers).map(player => (
        <div key={player["userId"]} className="LeaderboardInGame form">
          <div className="LeaderboardInGame avatar">
            <img src="/painter.png" alt="Avatar" className="LeaderboardInGame avatar"/>
          </div>
          <div className="LeaderboardInGame player">
            <div className="LeaderboardInGame username">
              {player["username"]}
            </div>
            <div className="LeaderboardInGame points">
              {player["totalPoints"]} points
            </div>
          </div>
        </div>
      ));
      setPlayers(updatedPlayers);
      setRenderedPlayers(playersArray); // Set the array of player components in the state
    }
  };

  return (
    <div className="LeaderboardInGame players">
      {renderedPlayers}
    </div>
  );
};

export default LeaderboardInGame;