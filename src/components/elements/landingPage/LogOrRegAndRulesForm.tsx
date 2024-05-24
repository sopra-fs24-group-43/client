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
  const [isGuest2, setIsGuest2] = useState();
  let registered

  registered = !(sessionStorage.getItem("username")=== null || sessionStorage.getItem("userId")=== null || sessionStorage.getItem("friends")=== null || sessionStorage.getItem("isGuest") === null)

  isGuest = sessionStorage.getItem("isGuest") === "true";
  //setIsGuest2(sessionStorage.getItem("isGuest") === "true")
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
      setIsGuest2(true)
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

  const logout = (): void => { //remove this?
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("gameId");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("isGuest");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("friends");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("gameStarted")
    sessionStorage.removeItem("hotkeyInputDraw");
    sessionStorage.removeItem("hotkeyInputFill");
    sessionStorage.removeItem("hotkeyInputEraser");
    sessionStorage.removeItem("hotkeyInputClear");
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("creation_date")
    if (stompApi.isConnected()) {
      console.log("disconnecting when logging out!")
      stompApi.disconnect()
    }
    navigate("/loginOrRegister");
  };
  const deleteguest = (): void => { //remove this?
    if (stompApi.isConnected()) {
      console.log("disconnecting when deleting guest!")
      stompApi.send("/app/landing/deletetempguestplayer/"+sessionStorage.getItem("userId"),"")
      stompApi.disconnect()
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("gameId");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("isGuest");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("friends");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("gameStarted")
    sessionStorage.removeItem("hotkeyInputDraw");
    sessionStorage.removeItem("hotkeyInputFill");
    sessionStorage.removeItem("hotkeyInputEraser");
    sessionStorage.removeItem("hotkeyInputClear");
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("creation_date")

    navigate("/landingpage");
  };
  const buttonlogout = () => {
    console.log("buttonlogout: ", registered, isGuest2 )
    if (registered) {
      if (isGuest2) {
        return (
          <Button width="100%" onClick={()=> deleteguest()}
                  Delete Temporary Guest Account
          ></Button>
        )
      }
      else {
        return (
          <Button width="100%" onClick={()=> logout()}
                  Log Out
          ></Button>
        )
      }
    }
    else {
      return ""
    }
  }
  const buttonforreg = () => {
    if (registered) {
      return <div>{isGuest ? "playing as guest" : ""}</div>;
    } else {
      return (
        <div>
          <Button width="100%" onClick={() => navigate("/LoginOrRegister")}>
            Login Or Register
          </Button>
          <Button
            width="100%"
            onClick={becomeaguest}
          >
            Play as Guest
          </Button>
        </div>
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
      <div className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} button-container`}>
        {buttonlogout()}

      </div>

      <div className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} img-form`}>
        <img src="rules.png" alt="Rule Icon"
             className={`LogOrRegAndRulesForm${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} img`}/>
      </div>
      <div className="LogOrRegAndRulesForm game-rules">
        <div>
          Freitagsmaler is a free online multiplayer drawing and guessing pictionary game.
          A normal game consists of a few rounds, where every round a player has to draw their chosen word and others
          have to guess it to gain points!
          The person with the most points at the end of the game, will then be crowned as the winner!
          <br/>
          <br/>
          Have fun!
        </div>
      </div>
    </div>
  );
};

export default LogOrRegAndRulesForm;
