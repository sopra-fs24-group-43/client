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
    await stompApi.connect(() => {
      const userId = sessionStorage.getItem("userId");
      stompApi.connected = true;

      stompApi.send("/app/landing/alertreconnect/"+userId, "") //added
      stompApi.subscribe("/topic/landing/alertreconnect/"+userId, handleResponse, "Players") //added
      console.log("subscribed when was NOT connected to the websocket in Players");
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Players");
    });
  };

  useEffect(() => {
    //reload hadling
    const handleBeforeUnload = (event) => {  //this gets executed when reloading the page, was commented
      console.log("disconnecting before reloading page!")
      const sessionAttributeDTO2 = {
        userId: null,
        reload: true
      }
      if (stompApi.isConnected()) {
        //stompApi.send("/app/games/sendreload", JSON.stringify(sessionAttributeDTO2))
        //stompApi.disconnect()
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

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

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Players");
    }
  }, [stompApi.isConnected()]); // [stompApi.isConnected()]

  const sendData = async () => { // needed for delaying the send function, so the connection is established
    await timeout(500); // !!!!! needs a little bit more time!
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

  // // setting friends
  // const [friends, setFriends] = useState([]);
  // const [isFriend, setIsFriend] = useState(false);
  // const userId = parseInt(sessionStorage.getItem("userId"), 10);

  // useEffect(() => {
  //   const fetchFriendsData = async () => {
  //     try {
  //       const friendsResponse = await api.get(`/users/${userId}/friends`);
  //       setFriends(friendsResponse.data);
  //     } catch (error) {
  //       console.error("Error fetching friends data: ", error);
  //     }
  //   };

  //   fetchFriendsData();
  // }, [userId, players]);

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
        // Check if the player is a friend
        // const isFriend = friends.some(friend => friend.id === player["userId"]);
        // console.log("friends some", friends.id, player["userId"]); 

        return (
          <div key={player["userId"]}>
            <Popover
              trigger={
                <div className="Players form">
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