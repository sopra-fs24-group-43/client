import React, {useState, useEffect, useContext} from "react";
import "styles/views/Table.scss"
import {useNavigate} from "react-router-dom";
import {Button} from "../../ui/Button";
import { Context } from "../../../context/Context";
import ReconnectPopUp from "../../views/ReconnectPopUp"
import InvitePopover from "components/ui/InvitePopover";


const Table = () => {

  const navigate = useNavigate();
  let [games, setgames] = useState(null)
  let [checkedgames, setcheckedgames] = useState(false)

  const context = useContext(Context)
  const {stompApi} = context

  let username
  let userId
  let isGuest
  let friends
  let registered
  const [reconnect, setReconnect] = useState(false)
  const [reconRole, setReconRole] = useState()
  const [reconGameId, setReconGameId] = useState()
  const [enableInviting, setEnableInviting] = useState(false)
  const [gameIdToJoin, setGameIdToJoin] = useState()
  let startGameId;
  const [friendUserId, setFriendUserId] = useState()

  registered = !(sessionStorage.getItem("username")=== null || sessionStorage.getItem("userId")=== null || sessionStorage.getItem("friends")=== null || sessionStorage.getItem("isGuest") === null)
  //const [time, setTime] = useState(new Date());


  if (registered) {
    console.log("gettings credentials from sessionStorage in Table")
    username = sessionStorage.getItem("username")
    userId = parseInt(sessionStorage.getItem("userId"))
    friends = sessionStorage.getItem("friends") //the string is "null" if no friends
    isGuest = sessionStorage.getItem("isGuest")
    console.log("got credentials in Table: username, userid, friends, isGuest: ", username, userId, friends, isGuest)
  }

  const gamestorender = () => {
    console.log("checkedout in render: " + checkedgames)


    if (registered === false){
      return "Log In To View And Join Available Lobbies!"
    }
    else if (checkedgames === false) {
      return ""
    }
    else if (games === null || games.length === 0)  {
      return "No Lobbies Have Been Created Yet!"
    }
    else {
      console.log("Rendering Lobbies!")
      let gamesList = [];
      const joingame = (gameId, inboundPlayer) => {
        console.log(inboundPlayer)
        if (stompApi.isConnected()) {
          stompApi.send("/app/games/" + gameId + "/joingame", JSON.stringify(inboundPlayer))
          sessionStorage.setItem("role", inboundPlayer.role)
          sessionStorage.setItem("gameId", inboundPlayer.gameId)
          navigate(`/lobby/${gameId}`,{state: {username: inboundPlayer.username, userId: inboundPlayer.userId, friends: inboundPlayer.friends, gameId: inboundPlayer.gameId, role: inboundPlayer.role}})
        }
      }
      games.forEach((game, index) => {
        const inboundPlayer = {
          type: "inboundPlayer",
          username: username,
          userId: userId,
          isGuest: isGuest,
          gameId: game[1],
          friends: [],
          role: "player"
        }
        if (game[3].length >= game[2]) {
          gamesList.push(
            <tr>
              <td>{game[0]}</td>
              <td>{game[1]}</td>
              <td>{game[2]}</td>
              <td>{game[3].length}/{game[3].length}</td>
            </tr>)
        }
        else {
          gamesList.push(
            <tr>
              <td>{game[0]}</td>
              <td>{game[1]}</td>
              <td>{game[2]}</td>
              <td>{game[3].length}/{game[2]}</td>
              <td> <Button width="100%" onClick={() => joingame(game[1],inboundPlayer)}>join</Button></td>
            </tr>)
        }
        /*
        gamesList.push(
          <tr>
            <td>{game[0]}</td>
            <td>{game[1]}</td>
            <td>{game[2]}</td>
            <td>{game[3].length}/{game[2]}</td>
            <td> <Button width="100%" onClick={() => joingame(game[1],inboundPlayer)}>join</Button></td>
          </tr>)

         */
      });
      return gamesList
    }
  }

  const Reconfunc = (userId, reconRole, reconGameId) => {
    if (stompApi.isConnected()) {
      console.log("reconfunc")
      sessionStorage.setItem("role", reconRole)
      sessionStorage.setItem("gameId", reconGameId)
      stompApi.send(`/app/landing/reconnect/${userId}`, "") //added
      navigate(`/game/${reconGameId}`)
      setReconnect(false)
    }
  }
  const handleResponse = (payload) => {
    var body = JSON.parse(payload.body)
    if (body.type === "ReconnectionDTO" && registered) {
      console.log("reconRole: "+body.role)
      console.log("reconGameId: "+body.gameId)
      setReconRole(body.role)
      setReconGameId(body.gameId)
      console.log("settings recon")
      setReconnect(true)
    }
    if (body.type === "deletegame" && registered) {  //trigger a request of getallgames because some game changed
      console.log("receiving deletegame inside Table -> getallgames")
      if (stompApi.isConnected()){
        stompApi.send("/app/landing/" + userId + "/getallgames", "");
      }
    }
    if (body.type === "updategamesettings" && registered) {
      console.log("receiving updategamesettings inside Table -> getallgames")
      if (stompApi.isConnected()){
        stompApi.send("/app/landing/" + userId + "/getallgames", "");
      }    }
    if (body.type === "creategame" && registered) {
      console.log("receiving creategame inside Table -> getallgames")
      if (stompApi.isConnected()){
        stompApi.send("/app/landing/" + userId + "/getallgames", "");
      }    }
    if (body.type === "startgame" && registered) {
      console.log("receiving startgame inside Table -> getallgames")
      console.log("receiving startgame inside Players -> checkfriend")
      startGameId = body.gameId;  //added mark
      console.log("checcking if startGameId === gameIdToJoin", startGameId, gameIdToJoin)
      if (startGameId === gameIdToJoin) {
        console.log("checcking if startGameId === gameIdToJoin", startGameId, gameIdToJoin)
        // setEnableInviting(false);
      }
      if (stompApi.isConnected()){
        stompApi.send("/app/landing/" + userId + "/getallgames", "");
      }    }
    if (body.type === "leavegame" && registered) {
      console.log("receiving leavegame inside Table -> getallgames")
      if (stompApi.isConnected()){
        stompApi.send("/app/landing/" + userId + "/getallgames", "");
      }    }
    if (body.type === "joingame" && registered) {
      console.log("receiving joingame inside Table -> getallgames")
      if (stompApi.isConnected()){
        stompApi.send("/app/landing/" + userId + "/getallgames", "");
      }    }
    if (body.type === "gamesDTO" && body.lobbyName.length !== 0 && registered) {  //handle the getallgames message
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
      setgames(templist)
      setcheckedgames(true)
      console.log("games (below):")
      console.log(games)
      console.log(templist)
    } 
    else if (body.type === "gamesDTO" && registered && body.lobbyName.length === 0 && registered) {
      setgames([])
      setcheckedgames(true)
    }

    else {
      console.log("not gamesDTO")
    }
    if (body.type === "invitefriend") {
      stompApi.subscribe(`/topic/landing/${body.gameId}`, handleResponse2, "Table")
      console.log("correct body type", body);
      setFriendUserId(body.userId)
      setEnableInviting(true);
      setGameIdToJoin(body.gameId);

    }
  }

  const handleResponse2 = (payload) => {
    const responseData = JSON.parse(payload.body);
    if (responseData.type === "startgame") {
      console.log("receiving startgame inside Players -> checkfriend")
      startGameId = responseData.gameId;  //added mark
      setEnableInviting(false);
    }
  }

  const connect = async ()  => {
    await stompApi.connect(() => {
      stompApi.send("/app/landing/alertreconnect/"+userId, "") //added
      stompApi.subscribe("/topic/landing/alertreconnect/"+userId, handleResponse, "Table") //added
      stompApi.subscribe("/topic/landing/" + userId, handleResponse, "Table")
      stompApi.subscribe("/topic/landing", handleResponse, "Table") //"/topic/landingTable"
      stompApi.connected = true //important!!! needs to be set during the onConnectedCallback, otherwise it might happen that it connected gets set true before the ws
                                //is fully setup
      stompApi.send("/app/landing/" + userId + "/getallgames" , "");
    });
  }
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10000);
    console.log("new setTime: ", time)
    return () => clearInterval(interval);
  }, [])
  */

  useEffect(() => {
    console.log("doing useEffect in Table")
    const handleBeforeUnload = (event) => {  //this gets executed when reloading the page
      console.log("disconnecting before reloading page!")
      const sessionAttributeDTO2 = {
        userId: null,
        reload: true
      }
      if (stompApi.isConnected()) {
        stompApi.send("/app/games/sendreload", JSON.stringify(sessionAttributeDTO2))
        stompApi.disconnect()
      }
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
  }, [registered]);  //, stompApi.isConnected()
  return (



  <div className={`Table container${sessionStorage.getItem("isDarkMode") ? "_dark" : ""}`}>
    <h2>Join a Lobby</h2>
    <table>
      <thead>
      <tr>
        <th>Lobby Name</th>
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
    <ReconnectPopUp reconnect={reconnect} setReconnect={setReconnect} Reconfunc={Reconfunc} userId={userId} reconRole={reconRole} reconGameId={reconGameId}/>
    {enableInviting && (
      <InvitePopover gameId={gameIdToJoin} friendUserId={friendUserId}/>
    )}
  </div>
)
  ;
};

export default Table;
