import React from "react";

interface InviteFriendProps {
  friendId: number;
  gameId: number;
  stompApi: any; 
}

const InviteFriend: React.FC<InviteFriendProps> = ({ friendId, gameId, stompApi }) => {

  console.log(`/app/games/${typeof gameId}/invitefriend/${friendId}, stompApi: ${typeof stompApi}`);

  const questionToSend = {
    type: "questionToSend",
    gameId: gameId,
    userId: sessionStorage.getItem("userId")
  }
  console.log("my userId is ", sessionStorage.getItem("userId"))
  stompApi.send(`/app/games/${gameId}/invitefriend/${friendId}`, JSON.stringify(questionToSend));

  return null;
};

export default InviteFriend;