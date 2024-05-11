import React, {useEffect, useContext} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import "styles/views/CreateJoinLobby.scss";
import StompApi from "../../../helpers/StompApi";
import { Button } from "components/ui/Button";
import {Context} from "../../../context/Context";

const stompApi = new StompApi()
export const changeview = false;
const CreateJoinLobby = () => {
  const navigate = useNavigate();
  var registered = false;
  var username;
  var userId;
  var friends = null;
  var role;
  var gameId;
  const context = useContext(Context)
  const {stompApi} = context

  console.log("1registered: "+registered)
  console.log("1username, userId: " + username + ", " + userId)

  if (useLocation()["state"] === null){
    if (localStorage.getItem("username")=== null && localStorage.getItem("userId")=== null && localStorage.getItem("friends")=== "null"){
      registered = false
    }
    else {
      console.log("gettings credentials from localStorage")
      username = localStorage.getItem("username")
      userId = parseInt(localStorage.getItem("userId"))
      friends = localStorage.getItem("friends")
      if (friends === "null") {friends = []}
      registered = true;
    }
  }
  else{
    console.log("gettings credentials from useLocation")
    username = useLocation()["state"]["username"];
    userId = useLocation()["state"]["userId"];
    friends = useLocation()["state"]["friends"];
    if (friends === null) {friends = []}
    registered = true;
  }

  console.log("1registered after: "+registered)
  console.log("1username, userId after: " + username + ", " + userId)

  const handleResponse = (payload) => {
    var body = JSON.parse(payload.body)
    if (body.type === "creategame"){
      console.log("handle: "+typeof body.userId)
      console.log("handle: "+body.userId)
      console.log("handle: "+typeof userId)
      console.log("handle: " + userId)
      if (body.userId === userId) {
        gameId = body.gameId
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
  }, []);

  const creategame = () => {
    const inboundPlayer = {
      type: "inboundPlayer",
      username: username,
      userId: userId,
      gameId: 101,
      friends: friends,
      role: "admin"
    }
    console.log("trying to sub: " + stompApi.isConnected())
    role = "admin"
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

      <div className="CreateJoinLobby button-container">
        <Button
          width="100%"
          onClick={() => {}}
        >
          does nothing, was join before
        </Button>
      </div>
    </div>
  );
};

export default CreateJoinLobby;