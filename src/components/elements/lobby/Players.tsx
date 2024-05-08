import React, { useEffect, useState } from "react";
import "../../../styles/views/lobby/Players.scss"

const Players = () => {

  return (
    <div className="Players container">
      <div className="Players header">
        Players
      </div>
      <div className="Players form">
        <div className="Players avatar">
          <img src="painter.png" className="Players avatar"/>
        </div>
        <div className="Players player">
          nickname
        </div>
      </div>
    </div>
  );
};

export default Players;