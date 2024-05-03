import React, { useState, useEffect } from "react";
import "styles/views/Table.scss"
import {useLocation, useNavigate} from "react-router-dom";
import StompApi from "../../helpers/StompApi";
import lobby from "../views/Lobby";
import {Button} from "../ui/Button";
const stompApi = new StompApi();
const UserTable = () => {

  const navigate = useNavigate();
  let [games, setgames] = useState(null)
  var registered = false;
  var username =null;
  var userId= null;
  const friends = [];
  var role;
  if (useLocation()["state"] === null){}
  else{
    console.log("registered: "+registered)
    console.log("username: " + username)
    console.log("userId: "+ userId)
    registered = true;
    username = useLocation()["state"]["username"];
    userId = useLocation()["state"]["userId"];
    console.log("registered after: "+registered)
    console.log("username after: " + username)
    console.log("userId after: "+ userId)
  }
  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/loginOrRegister");
  };

  const gamestorender = () => {
    if (registered === false){
      console.log("need to be logged in to see lobbies!")
      return "log in to view and join available lobbies!"
    }
    else if (games === null || games.length === 0)  {
      console.log("no lobbies have been created yet!")
      return "no lobbies have been created yet!"
    }
    else {
      console.log("rendering Lobbies!")
      let gamesList = [];
      const joingame = (gameId, inboundPlayer) => {
        console.log(inboundPlayer)
        stompApi.send("/app/games/" + gameId + "/joingame", JSON.stringify(inboundPlayer))
        stompApi.unsubscribe("/topic/landing/" + userId)
        stompApi.unsubscribe("/topic/landing")
        navigate("/lobby", {state:{inboundPlayer:inboundPlayer}})
      }
      games.forEach((game, index) =>  {
        const inboundPlayer = {
          type: "inboundPlayer",
          username: username,
          userId: userId,
          gameId: game[1],
          friends: friends,
          role: "player"
        }



        gamesList.push(
          <tr>
            <td>{game[0]}</td>
            <td>{game[1]}</td>
            <td>{game[2]}</td>
            <td>{game[3].length}/{game[2]}</td>
            <td> <Button width="100%" onClick={() => joingame(game[1],inboundPlayer)}>join</Button></td>
          </tr>)


      });

      return gamesList
    }
  }


  const handleResponse = (payload) => {
    var body = JSON.parse(payload.body)

    if (body.type === "inboundPlayer" && registered){
      stompApi.send("/app/landing/" + userId + "/getallgames" , "");
    }

    if (body.type === "gamesDTO" && body.lobbyName.length !== 0) {
      console.log("body.lobbyNamelength:"+body.lobbyName.length)
      var lobbyNames = body.lobbyName
      var gameIds = body.gameId
      var maxPlayerss = body.maxPlayers
      var playerss = body.players
      var gamePasswords = body.gamePassword


      console.log(body)
      console.log(body.lobbyName)
      console.log(body.gameId)
      console.log(body.maxPlayers)
      console.log(body.players)
      setgames(null)
      let templist = []
      for (var i = 0; i < lobbyNames.length; i++) {
        var game = [lobbyNames[i], gameIds[i], maxPlayerss[i], playerss[i], gamePasswords[i]]
        console.log("game (below):")
        console.log(game)

        templist = [...templist, game]
        game = []
      }
      setgames(templist)

      console.log("games (below):")
      console.log(games)

    }
    else {
      console.log("no games created yet")
    }
  }
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }
  const send = async () => {
    await timeout(1500);
    stompApi.send("/app/landing/" + userId + "/getallgames" , "");
  }
  const connect = async ()  => {

    stompApi.connect();
    await timeout(1000);
    stompApi.subscribe("/topic/landing/" + userId, handleResponse)
    stompApi.subscribe("/topic/landing", handleResponse)
    stompApi.send("/app/landing/" + userId + "/getallgames" , "");
  }
  useEffect(() => {
    console.log("run useEffect!")
    if (!stompApi.isConnected() && registered) {    //need to be registerd and not connected already to connect
      console.log("connecting to ws in Table view")
      connect();
    }
    //send()


  });
  return (



  <div className="Table container">
    <h2>User Table</h2>
    <table>
      <thead>
      <tr>
        <th>Lobby</th>
        <th>Game ID</th>
        <th>Max Players</th>
        <th>Players</th>
        <th>Join</th>

      </tr>
      </thead>
      <tbody>

      {gamestorender()}
      </tbody>
    </table>
  </div>
)
  ;
};

export default UserTable;
