import React, {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import "styles/views/CreateJoinLobby.scss";
import StompApi from "../../helpers/StompApi";
import { Button } from "components/ui/Button";
import game from "../views/Game";

const stompApi = new StompApi();
const CreateJoinLobby = () => {
  const navigate = useNavigate();
  var registered = false;
  var username;
  var userId;
  var friends = null;
  var role;
  var gameId;

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


  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }
  const handleResponse = (payload) => {
    var body = JSON.parse(payload.body)
    if (body.type === "creategame"){
      console.log("handle: "+typeof body.userId)
      console.log("handle: "+body.userId)
      console.log("handle: "+typeof userId)
      console.log("handle: " + userId)
      if (body.userId === userId) {
        gameId = body.gameId
        //stompApi.disconnect()
        //stompApi.unsubscribe("/topic/landing")
        console.log("username, userId, gameId, role: ", username, userId, gameId, role)
        navigate("/lobby", {state: {username: username, userId: userId, friends: friends, gameId: gameId, role: role}})
      }
      else {
        console.log("creategame from other user")
      }
    }
    else {console.log("not creategame")}


  }

  const  connect = async ()=>{
    stompApi.connect();
    await timeout(1000);
    stompApi.subscribe("/topic/landing", handleResponse)
  }
  useEffect(() => {
    console.log("user is connected: " + registered)
    if (registered && !stompApi.isConnected()){
      console.log("connecting to ws in CreateJoinLobby view")
      connect();
    }
  }, );

  const creategame = () => {
    const inboundPlayer = {
      type: "inboundPlayer",
      username: username,
      userId: userId,
      gameId: 101,
      friends: friends,
      role: "admin"
    }

    role = "admin"
    stompApi.send("/app/landing/creategame", JSON.stringify(inboundPlayer));
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