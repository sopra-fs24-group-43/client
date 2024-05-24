import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import { api, handleError } from "../../../helpers/api.js";
import Popover from "components/ui/Popover";
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
    await timeout(700);
    await stompApi.connect(() => {
      const userId = sessionStorage.getItem("userId");
      stompApi.connected = true;
      console.log("sending data from the Players when connecting");
      stompApi.send("/app/landing/alertreconnect/"+userId, "") //added
      stompApi.subscribe("/topic/landing/alertreconnect/"+userId, handleResponse, "Players") //added
      console.log("subscribed when was NOT connected to the websocket in Players");
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Players");
      console.log(`invite in players /topic/games/${lobbyId}/general/${sessionStorage.getItem("userId")}`);
    });
  };

  // deleting the lobby if you the creator
  const deleteLobby = async () => {
    sessionStorage.removeItem("gameId");
    stompApi.send(`/app/games/${lobbyId}/deletegame`, JSON.stringify(lobbyId));
  }

  // leaving from the lobby if you are a player
  const leaveLobby = async () => {
    sessionStorage.removeItem("gameId");
    stompApi.send(`/app/games/${lobbyId}/leavegame/${sessionStorage.getItem("userId")}`, "");
    navigate("/LandingPage");
  }

  useEffect(() => {
    //reload hadling
    const handleBeforeUnload = () => {  //this gets executed when reloading the page, was commented
      const sessionAttributeDTO2 = {
        userId: null,
        reload: true
      }
      if (stompApi.isConnected()) {
        console.log("sending data from the Players when is connected");
        stompApi.send("/app/games/sendreload", JSON.stringify(sessionAttributeDTO2))
        stompApi.disconnect()
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // navigation arrows handling
    // artificially added url to the history stack
    history.pushState({}, '', `/lobby/${lobbyId}`);
    const popstateHandler = () => {
      console.log("User navigated using browser back/forward button");
      if (sessionStorage.getItem("role") === "player") {
        leaveLobby();
      } else if (sessionStorage.getItem("role") === "admin") {
        deleteLobby()
      }
    };

    window.addEventListener("popstate", popstateHandler);

    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Players");
      console.log(`invite in players /topic/games/${lobbyId}/general/${sessionStorage.getItem("userId")}`);
      console.log("subscribed when was connected to the websocket in Players");
    };

    // if not connected
    if (!stompApi.isConnected()){
      console.log("connecting to ws in Players view");
      connect();
      // stompApi.send(`/app/games/${lobbyId}/getlobbyinfo`, JSON.stringify(lobbyId));
      console.log("connected");

      console.log("sending data from the Players when not connected");
      sendData();
    };

    if (stompApi.isConnected()){
      sendData();
    };

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", popstateHandler);
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Players");
    }
  }, [stompApi.isConnected()]); // [stompApi.isConnected()]

  const sendData = async () => { // needed for delaying the send function, so the connection is established
    await timeout(800); // !!!!! needs a little bit more time!
    // delete the event listener
    console.log("sending the message from the Players");
    stompApi.send(`/app/games/${lobbyId}/getlobbyinfo`, "");
  };

  // rest
  const sendFriendRequest = async (friendUsername) => { // username of a potential friend
    try {
      const userId = parseInt(sessionStorage.getItem("userId"), 10); // userId of current user

      console.log("userId = ", userId, "friendsUsername = ", friendUsername);
      await api.post(`/users/${userId}/openfriendrequests`, null, {
        params: { friend_username: friendUsername, delete: false }
      });

      const all = await api.get(`/users/${2}/openfriendrequests`);
      console.log("open requests: ", all.data);
    } catch (error) {
      console.error(`Error updating user data: ${handleError(error)}`);
    }
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

      // with Popover
      const playersArray = Object.values(updatedPlayers).map(player => {
        return (
          <div key={player["userId"]}>
            <Popover
              trigger={
                <div className={`Players${localStorage.getItem("isDarkMode") ? "_dark" : ""} form`}>
                  <div className={`Players${localStorage.getItem("isDarkMode") ? "_dark" : ""} avatar`}>
                    <img src="/painter.png" alt="Avatar" className={`Players${localStorage.getItem("isDarkMode") ? "_dark" : ""} avatar`}/>
                  </div>

                  <div className={`Players${localStorage.getItem("isDarkMode") ? "_dark" : ""} player`}>
                    <div className={`Players${localStorage.getItem("isDarkMode") ? "_dark" : ""} username`}>
                      {player["username"]} {sessionStorage.getItem("username") === player["username"] && " (You)"}

                    </div>
                    <div className={`Players${localStorage.getItem("isDarkMode") ? "_dark" : ""} points`}>
                      {player["newlyEarnedPoints"]} points
                    </div>
                  </div>
                </div>
              }
              // disabled={friends.some(friend => friend.id === player["userId"])}
              content={({ closepopover }) => (
                <div>
                  <Button onClick={() => {
                    sendFriendRequest(player["username"]);
                    closepopover();
                  }}>
                    Add Friend
                  </Button>
                </div>
              )}
              playerId={player["userId"]}
            />
          </div>
        );
      });

      setPlayers(updatedPlayers);
      setRenderedPlayers(playersArray); // Set the array of player components in the state
    }
    if (responseData.type === "deletegame") {
      navigate("/LandingPage");
    }
    if (responseData.type === "ReconnectionDTO") {
      console.log("reconRole: "+responseData.role)
      console.log("reconGameId: "+responseData.gameId)
      console.log("settings recon Players")
    }
    if (responseData.type === "lobbyIsNull") {
      sessionStorage.removeItem("gameId");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("gameStarted");
      navigate("/LandingPage");
    }
  };

  return (
    <div className={`Players${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} container`}>
      <div className={`Players${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} players`}>
        <div className={`Players${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} header`}>
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