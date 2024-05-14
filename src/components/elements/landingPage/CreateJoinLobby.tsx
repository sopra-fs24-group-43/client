import React, {useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import "styles/views/CreateJoinLobby.scss";

import { Button } from "components/ui/Button";
import {Context} from "../../../context/Context";

export const changeview = false;
const CreateJoinLobby = () => {
  const navigate = useNavigate();
  let username
  let userId
  let gameId
  let isGuest
  let friends
  let role
  let registered




  const context = useContext(Context)
  const {stompApi} = context
  registered = (!(sessionStorage.getItem("username")=== null || sessionStorage.getItem("userId")=== null || sessionStorage.getItem("friends")=== null || sessionStorage.getItem("isGuest") === null))



  if (registered) {
    console.log("gettings credentials from sessionStorage in CreateJoinLobby")
    username = (sessionStorage.getItem("username"))
    userId = (parseInt(sessionStorage.getItem("userId")))
    friends = (sessionStorage.getItem("friends")) //is the String "null" if user has no friends
    isGuest = (sessionStorage.getItem("isGuest"))
    console.log("got credentials in CreateJoinLobby: username, userid, friends, isGuest: ", username, userId, friends, isGuest)
  }

  const handleResponse = (payload) => {
    var body = JSON.parse(payload.body)
    if (body.type === "creategame"){
      if (body.userId === userId) {
        gameId = (body.gameId)
        console.log("username, userId, gameId, role: ", username, userId, gameId, role)
        localStorage.setItem("role", role)
        navigate(`/lobby/${gameId}`, {state: {username: username, userId: userId, friends: friends, gameId: gameId, role: role}}) // is sent to the lobby
      }
      else {
        console.log("creategame from other user")
      }
    }
    else {console.log("received something that is not creategame (in CreateJoinLobby)")}


  }

  useEffect(() => {

    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing when navigating to different view from CreateJoinLobby!")
      stompApi.unsubscribe("/topic/landing", "CreateJoinLobby")
    }
  }, [registered]);

  const creategame = () => {
    const inboundPlayer = {
      type: "inboundPlayer",
      username: username,
      userId: userId,
      isGuest: isGuest,
      gameId: 101,
      friends: [],
      role: "admin"
    }
    console.log("trying to sub: " + stompApi.isConnected())
    role = ("admin")
    if (stompApi.isConnected()){
      console.log("trying to sub: ")
      stompApi.subscribe("/topic/landing", handleResponse, "CreateJoinLobby")
      stompApi.send("/app/landing/creategame", JSON.stringify(inboundPlayer));
    }

  }
  return (
    <div className="CreateJoinLobby container">

      <div className="CreateJoinLobby button-container">

        <Button
          width="100%"
          onClick={creategame}
        >
          Create lobby
        </Button>
      </div>
    </div>
  );
};

export default CreateJoinLobby;