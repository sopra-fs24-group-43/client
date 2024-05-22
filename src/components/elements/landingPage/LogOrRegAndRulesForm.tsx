import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LogOrRegAndRulesForm.scss"
import {Context} from "../../../context/Context";
const LogOrRegAndRulesForm = () => {
  const navigate = useNavigate();
  const context = useContext(Context)
  const {stompApi, reload, setReload} = context

  let isGuest
  let registered

  registered = !(sessionStorage.getItem("username")=== null || sessionStorage.getItem("userId")=== null || sessionStorage.getItem("friends")=== null || sessionStorage.getItem("isGuest") === null)

  isGuest = sessionStorage.getItem("isGuest") === "true";
  const handleResponse = (payload) => {
    var body = JSON.parse(payload.body)
    if (body.type === "createPlayerFromGuest") {
      sessionStorage.setItem("token", body.userId); //just to make it work for now
      sessionStorage.setItem("username", body.username);
      sessionStorage.setItem("userId", body.userId);
      sessionStorage.setItem("friends", "null");
      sessionStorage.setItem("isGuest", body.isGuest);
      sessionStorage.setItem("hotkeyInputDraw", "D");
      sessionStorage.setItem("hotkeyInputFill", "F");
      sessionStorage.setItem("hotkeyInputEraser", "E");
      sessionStorage.setItem("hotkeyInputClear", "C");
      isGuest = true
      setReload(!reload)
      const sessionAttributeDTO1 = {
        userId: body.userId,
        reload: null
      }
      stompApi.send("/app/games/senduserId", JSON.stringify(sessionAttributeDTO1))

      stompApi.unsubscribe("/topic/landing", "LogOrRegAndRulesForm")
    }
  }
  const connect =  () => {
    stompApi.connect(() => {
      stompApi.subscribe("/topic/landing", handleResponse, "LogOrRegAndRulesForm")
      stompApi.connected = true
      stompApi.send("/app/landing/createguestplayer" , "");
    });
  }
  const becomeaguest = () => {
    if (!stompApi.isConnected()) {
      console.log("connecting to ws!")
      connect();
    }
  }
  const buttonforreg = () => {
    if (registered) {
      return <div>{isGuest ? "playing as guest" : "logged in"}</div>;
    } else {
      return (
        <Button width="100%" onClick={() => navigate("/LoginOrRegister")}>
          Login Or Register
        </Button>
      );
    }
  };
  
  const buttonforguest = () => {
    if (registered) {
      return ""
    }
    else {
      return (
        <Button
          width="100%"
          onClick={becomeaguest}
        >
          Play as Guest
        </Button>
      )
    }
  }
  return (
    <div className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} form`}>
      <div className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} button-container`}>
        {buttonforreg()}
      </div>
      {buttonforguest()}
      <div className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} img-form`}>
        <img src="rules.png" alt="Rule Icon" className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} img`} />
      </div>
      <div className="LogOrRegAndRulesForm game-rules">
        <div>
            Freitagsmaler is a free online multiplayer drawing and guessing pictionary game. 
            A normal game consists of a few rounds, where every round a player has to draw their chosen word and others have to guess it to gain points! 
            The person with the most points at the end of the game, will then be crowned as the winner!
          <br />
          <br />
            Have fun!
        </div>
      </div>
    </div>
  );
};

export default LogOrRegAndRulesForm;
