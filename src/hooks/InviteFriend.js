import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";

const InviteFriend = (props) => {
  // getting contex
  // const context = useContext(Context);
  // const {stompApi} = context;  

  // getting lobbyId
  // const { gameId } = useParams();
  // const lobbyId = parseInt(gameId);

  // stompApi.send(`/app/games/${lobbyId}/invitefriend/${sessionStorage.getItem("userId")}/${props.friendUsername}`, "");
  console.log(`/app/games//invitefriend/${sessionStorage.getItem("userId")}/${props.friendUsername}`);

  return null;
};

export default InviteFriend;