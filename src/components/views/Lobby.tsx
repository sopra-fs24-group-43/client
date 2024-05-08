import React, { useState } from "react";
//import "../../styles/views/Lobby.scss"
import {useLocation} from "react-router-dom";

const Lobby = () => {
  let a = useLocation()["state"]
  console.log("this is useLocation in Lobby: " + JSON.stringify(a))
  return (
    <div className="Lobby container">

    </div>
  );
};

export default Lobby;