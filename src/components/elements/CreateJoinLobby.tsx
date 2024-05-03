import React, {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import "styles/views/CreateJoinLobby.scss";
import StompApi from "../../helpers/StompApi";
import { Button } from "components/ui/Button";

const stompApi = new StompApi();
const CreateJoinLobby = () => {
  const navigate = useNavigate();
  var registered = false;
  var username;
  var userId;
  const friends = [];
  var role;
  if (useLocation()["state"] === null){}
  else{
    registered = true;
    username = useLocation()["state"]["username"];
    userId = useLocation()["state"]["userId"];
    //alert("username: "+ username);
    //alert("id: "+ userId);

  }

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }
  const handleResponselanding = (payload) => {
    var body = payload.body;
    if (body.type === "inboundPlayer"){
    }
    else {console.log("not inboundPlayer")}


  }
  const handleResponsegames = (payload) => {
    var body = payload.body;


    return payload;
  }

  const  connect = async ()=>{
    stompApi.connect();
    await timeout(1000);
    stompApi.subscribe("/topic/landing", handleResponselanding)
    stompApi.subscribe("/topic/games/1/general", handleResponsegames)
  }
  useEffect(() => {
    console.log("user is connected: " + registered)
    if (registered && !stompApi.isConnected()){connect();}
    else {}
  }, [registered]);

  const sendit = () => {

    const inboundPlayer = {
      type: "inboundPlayer",
      username: username,
      userId: userId,
      gameId: 1001,
      friends: friends,
      role: "admin"
    }
    role = "admin"
    stompApi.send("/app/landing/creategame", JSON.stringify(inboundPlayer));
    stompApi.unsubscribe("/topic/games/1/general")
    stompApi.unsubscribe("/topic/landing")
    //navigate("/lobby")
  }
  const sendit2 = () => {

    const inboundPlayer = {
      type: "inboundPlayer",
      username: username,
      userId: userId,
      gameId: 1001,
      friends: friends,
      role: "player"
    }
    role = "player";
    stompApi.send("/app/games/1/joingame", JSON.stringify(inboundPlayer));
    //navigate("/lobby")
  }

  return (
    <div className="CreateJoinLobby container">

      <div className="CreateJoinLobby button-container">

        <Button
          width="100%"
          onClick={sendit}
        >
          Create lobby
        </Button>
      </div>

      <div className="CreateJoinLobby button-container">
        <Button
          width="100%"
          onClick={sendit}
        >
          Join lobby
        </Button>
      </div>
    </div>
  );
};

export default CreateJoinLobby;