import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/lobby/Lobby.scss"

import Players from "components/elements/lobby/Players";
import Settings from "components/elements/lobby/Settings";
import StartGame from "components/elements/lobby/StartGame";
//import { Context } from "../../context/Context";

// import { stompApi } from "./LandingPage";

const Lobby = () => {
  let rawUserData = useLocation()["state"];
  console.log("this is useLocation in Lobby: " + JSON.stringify(rawUserData));

  // const navigate = useNavigate();
  
  // // getting the gameId from the url
  // const { gameId } = useParams();
  // const lobbyId = parseInt(gameId);

  // // getting contex
  // const context = useContext(Context);
  // const {stompApi} = context;  //or const stompApi = context.stompApi

  // // websocket connection establishing
  // function timeout(delay: number) {
  //   return new Promise( res => setTimeout(res, delay) );
  // };
  
  // // const connect = async ()=>{
  // //   stompApi.connect((() => {
  // //     stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Lobby");
  // //     console.log("subscribed when was NOT connected to the websocket in Lobby");
  // //     stompApi.connected = true;
  // //   }));
  // //   await timeout(1000);
  // // };

  // useEffect(() => {
  //   console.log("Lobby's UseState !!!!!!!!!!");
  //   // subscribing
  //   if (stompApi.isConnected()){
  //     stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Lobby");
  //     console.log("subscribed when was connected to the websocket in Lobby");
  //   };

  //   // if not connected
  //   // if (!stompApi.isConnected()){
  //   //   console.log("connecting to ws in Lobby view");
  //   //   connect();
  //   //   console.log("connected");
  //   // };

  //   // unsub
  //   return () => {  //this gets executed when navigating another page
  //     console.log("unsubscribing and cleaning up when navigating to different view from Lobby!");
  //     stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Lobby");
  //   };
  // }, ); // [stompApi.isConnected()]

  // const sendData = async () => { // needed for delaying the send function, so the connection is established
  //   await timeout(1000);
  //   console.log("sending the message from the Lobby");
  //   stompApi.send(`/app/games/${lobbyId}/startgame`, ""); // JSON.stringify({type: "startgame"})
  // };

  // const startGame = () => {
  //   console.log("sending data from the Lobby");
  //   if (stompApi.isConnected()){
  //     sendData();
  //   };
  // };

  // const handleResponse = (payload) => {
  //   const responseData = JSON.parse(payload.body);
  //   console.log("handling the response in Lobby");

  //   if (responseData.type === "startgame") {
  //     console.log("handling the response in Lobby when type = startgame");
  //     // navigate(`/game/${lobbyId}`)
  //   }
  // };
  
  return (
    <div className="Lobby container">
      <Players/>
      <div className="Lobby form">
        <Settings/>
        <StartGame/>
      </div>
    </div>
  );
};
  
export default Lobby;
