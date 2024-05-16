import React, {useState, useEffect, useCallback, useContext} from "react";
import "styles/views/Table.scss"
import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "../../ui/Button";
import { Context } from "../../../context/Context";


const Table = () => {

  const navigate = useNavigate();
  let [games, setgames] = useState(null)
  let [checkedgames, setcheckedgames] = useState(false)
  let registered = false;
  let username =null;
  let userId= null;
  let friends = null;
  const context = useContext(Context)
  const {stompApi} = context  //or const stompApi = context.stompApi
  const username1 = context.username;
  const setUsername1 = context.setUsername;

  console.log("registered: "+registered)
  console.log("username, userId: " + username + ", " + userId)
  if (useLocation()["state"] === null){
    if (localStorage.getItem("username")=== null && localStorage.getItem("userId")=== null && localStorage.getItem("friends")=== null){
      registered = false
    }
    else {
      console.log("gettings credentials from localStorage")
      //setUsername1(localStorage.getItem("username")) //temporary!!!
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
  console.log("username1: " + username1)//temporary

  const gamestorender = () => {
    console.log("new render?????")
    console.log("checkedout in render: " + checkedgames)


    if (registered === false){
      console.log("need to be logged in to see lobbies!")
      return "log in to view and join available lobbies!"
    }
    else if (checkedgames === false) {
      console.log("hasn't handled any response from getallgames")
      return ""
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
        localStorage.setItem("role", inboundPlayer.role)
        navigate(`/lobby/${gameId}`,{state: {username: inboundPlayer.username, userId: inboundPlayer.userId, friends: inboundPlayer.friends, gameId: inboundPlayer.gameId, role: inboundPlayer.role}})
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
    if (body.type === "deletegame" && registered) {
      console.log("deletegame received")
    }
    if (body.type === "creategame" && registered){
      console.log("receiving crategame inside Table")
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
    }
    else {
      setcheckedgames(true)
      console.log("no games received in getallgames")
    }
  }


  const connect = async ()  => {
    await stompApi.connect(() => {
      stompApi.subscribe("/topic/landing/" + userId, handleResponse, "Table")
      stompApi.subscribe("/topic/landing", handleResponse, "Table")
      stompApi.send("/app/landing/" + userId + "/getallgames" , "");
      stompApi.connected = true //important!!! needs to be set during the onConnectedCallback, otherwise it might happen that it connected gets set true before the ws
                                //is fully setup
    });


  }
  useEffect(() => {
    const handleBeforeUnload = (event) => {  //this gets executed when reloading the page
      console.log("disconnecting before reloading page!")
      stompApi.disconnect()
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (!stompApi.isConnected() && registered) {    //need to be registerd and not connected already to connect
      console.log("connecting to ws!")
      connect();
    }
    if (checkedgames === false && stompApi.isConnected() && registered){  //this is for when you navigate back to Landingpage and you are already connected to ws but
                                                                          //you are not subscribed to any channel. (checks if subscribed and if not it does so
      let subscribed = stompApi.issubscribedto("/topic/landing/" + userId, "Table")

      if (!subscribed){
        stompApi.subscribe("/topic/landing/" + userId, handleResponse, "Table")
      }
      subscribed= stompApi.issubscribedto("/topic/landing", "Table")
      if (!subscribed){
        stompApi.subscribe("/topic/landing", handleResponse, "Table")
      }
      stompApi.send("/app/landing/" + userId + "/getallgames" , "");
    }
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from Table!")
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stompApi.unsubscribe("/topic/landing/" + userId, "Table")
      stompApi.unsubscribe("/topic/landing", "Table")
    }


  }, []);
  return (



  <div className={`Table container${localStorage.getItem("isDarkMode") ? "_dark" : ""}`}>
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

export default Table;
