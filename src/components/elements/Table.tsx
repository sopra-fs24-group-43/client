import React, { useState, useEffect, useCallback } from "react";
import "styles/views/Table.scss"
import {useLocation, useNavigate} from "react-router-dom";
import StompApi from "../../helpers/StompApi";
import lobby from "../views/Lobby";
import {Button} from "../ui/Button";
const stompApi = new StompApi();
const UserTable = () => {

  const navigate = useNavigate();
  let [games, setgames] = useState(null)
  let [checkedgames, setcheckedgames] = useState(false)
  let [florian, setflorian] = useState(0)
  let registered = false;
  let username =null;
  let userId= null;
  let friends = null;
  let role;
  console.log("registered: "+registered)
  console.log("username, userId: " + username + ", " + userId)
  if (useLocation()["state"] === null){
    if (localStorage.getItem("username")=== null && localStorage.getItem("userId")=== null && localStorage.getItem("friends")=== null){
      registered = false
    }
    else {
      console.log("gettings credentials from localStorage")
      username = localStorage.getItem("username")
      userId = parseInt(localStorage.getItem("userId"))
      friends = localStorage.getItem("friends") //is the String "null" if user has no friends

      if (friends === "null") {friends = []}
      registered = true;
    }
  }
  else{
    console.log("gettings credentials from useLocation")
    username = useLocation()["state"]["username"];
    userId = useLocation()["state"]["userId"];
    friends = useLocation()["state"]["friends"];// is object null if user has no friends
    if (friends === null) {friends = []}
    registered = true;
  }

  console.log("registered after: "+registered)
  console.log("username, userId after: " + username + ", " + userId)

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/loginOrRegister");
  };

  const gamestorender = () => {
    console.log("new render?????")
    console.log("checkedout in render: " + checkedgames)


    if (registered === false){
      console.log("need to be logged in to see lobbies!")
      return "log in to view and join available lobbies!"
    }
    else if (checkedgames === false) {
      console.log("hasn't handled any response from getallgames")
      return "haha"
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
        //stompApi.disconnect()
        //stompApi.unsubscribe("/topic/landing/" + userId)
        //stompApi.unsubscribe("/topic/landing")
        navigate("/lobby",{state: {username: inboundPlayer.username, userId: inboundPlayer.userId, friends: inboundPlayer.friends, gameId: inboundPlayer.gameId, role: inboundPlayer.role}})
      }
      games.forEach((game, index) => {
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

    if (body.type === "creategame" && registered){
      stompApi.send("/app/landing/" + userId + "/getallgames" , "");
    }

    if (body.type === "gamesDTO" && body.lobbyName.length !== 0) {
      console.log("body.lobbyNamelength:"+body.lobbyName.length)
      var lobbyNames = body.lobbyName
      var gameIds = body.gameId
      var maxPlayerss = body.maxPlayers
      var playerss = body.players
      var gamePasswords = body.gamePassword

      setgames(null)
      let templist = []
      for (var i = 0; i < lobbyNames.length; i++) {
        var game = [lobbyNames[i], gameIds[i], maxPlayerss[i], playerss[i], gamePasswords[i]]
        console.log("game (below):")
        console.log(game)

        templist = [...templist, game]
        game = []
      }
      console.log("everything: reged, games, checkedgames ", registered, games, checkedgames)
      setgames(templist)
      setcheckedgames(true)
      console.log("checkedout in handle: " + checkedgames)
      console.log("games (below):")
      console.log(games)
      console.log(templist)
      console.log("everything: reged, games, checkedgames ", registered, games, checkedgames)
      console.log("florian: " + florian)
      setflorian(1)
    }
    else {
      setcheckedgames(true)
      console.log("no games received in getallgames")
    }
  }
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }
  const getallgames = async () => {
    await timeout(1000);
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
    console.log("checkedgames in useEffect: "+checkedgames)
    if (checkedgames === false && stompApi.isConnected() && registered){
      console.log("this in checkedgame")
      getallgames()
    }

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
    {florian}
  </div>
)
  ;
};

export default UserTable;
