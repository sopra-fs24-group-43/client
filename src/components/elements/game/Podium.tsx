import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "../../../styles/views/game/Podium.scss"
import logoPic3 from './painter.png';

import { Context } from "../../../context/Context";

const Podium = () => {
  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);

  // getting contex
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  useEffect(() => {
    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Podium");
      console.log("subscribed when was connected to the websocket in Podium");
    };
 
    // cleaning up
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from Podium!");
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Podium");
    };
  }, []); // [stompApi.isConnected()]

  // create lists to track players in the lobby
  const [players, setPlayers] = useState({}); // before <{[key: string]: any}>
  const [podiumPlayers, setPodiumPlayers] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [winner, setWinner] = useState();
  const [isEndGame, setIsEndGame] = useState<boolean>();

  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body);
    console.log("the response data in Podium", responseData);
    if (responseData.type === "leaderboard") {
      // set Players
      setPlayers(responseData.userIdToPlayerSorted);
      setIsEndGame(responseData.endGame);
      console.log("IsEndGamae === ", responseData.endGame, isEndGame);
      // convert the updated player list to an array of player components
      const playerEntries = Object.entries(responseData.userIdToPlayerSorted);
      // const top3Players = playerEntries.slice(0, 3).map(([key, player]) => (
      //   <div key={player["userId"]} className={`Podium top${player["podiumPosition"]}-player`}>
      //     <img src="/painter.png" alt="Avatar" className="Podium top-avatar"/>
      //     <div className="Podium player-info">
      //       <div className="Podium top-username">
      //         {"#" + player["podiumPosition"] + "   "+ player["username"]}
      //       </div>
      //       <div className="Podium top-points">
      //         {player["totalPoints"]} points
      //       </div>
      //     </div>
      //   </div>
      // ));
      // setPodiumPlayers(top3Players);

      const afterTop3Players = playerEntries.map(([key, player]) => (
        <div key={player["userId"]} className="Podium other-player">
          <img src={logoPic3} alt="Avatar" className="Podium other-avatar"/>
          <div className="Podium player-info">
            <div className="Podium other-username">
              {"#" + player["podiumPosition"] + "   "+ player["username"]}
            </div>
            <div className="Podium other-points">
              {player["totalPoints"]} points
            </div>
          </div>
        </div>
      ));
      setOtherPlayers(afterTop3Players);

      // setting a winner
      const winnerPlayer = playerEntries.find(([key, player]) => player["podiumPosition"] === 1);
      setWinner(winnerPlayer ? winnerPlayer[1]["username"] : "");
    }
  };

  return (
    <React.Fragment>
      {isEndGame && (
        <div className="Podium container">
          <div className="Podium title">
            {winner} is the winner!
          </div>
          {/* <div className="Podium podium-players">
            {podiumPlayers}
          </div> */}
          <div className="Podium other-players">
            {otherPlayers}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Podium;