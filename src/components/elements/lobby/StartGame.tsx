import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";

import { Context } from "../../../context/Context";

const StartGame = () => {
  const navigate = useNavigate();

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // getting contex
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  // checking if a user is a creator of a lobby
  const [isAdmin, setIsAdmin] = useState(false);

  // checking if a user is a creator of a lobby 
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  useEffect(() => {
    console.log("subscribing in StartGame view");
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "StartGame");
    };

    //unsub
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from StartGame!");
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "StartGame");
    };
  },[]);

  const startGame = () => {
    console.log("sending data from the StartGame");
    console.log("lobbyId: ", lobbyId);
    if (stompApi.isConnected()){
      sendData();
    };
  };

  const sendData = async () => { // needed for delaying the send function, so the connection is established
    // await timeout(4000);
    console.log("sending the message from the Startgame");
    stompApi.send(`/app/games/${lobbyId}/startgame`, ""); // JSON.stringify({type: "startgame"})
  };

  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body);
    console.log("handling the response in Startgame");

    if (responseData.type === "GameStateDTO") {
      console.log("handling the response in Startgame when type = startgame");
      navigate(`/game/${lobbyId}`);
    }
  };

  return (
    <React.Fragment>
      {isAdmin && (
        <Button
          width="100%"
          onClick={startGame}
        >
          Start Game
        </Button>
      )}
    </React.Fragment>
  );
};

export default StartGame;