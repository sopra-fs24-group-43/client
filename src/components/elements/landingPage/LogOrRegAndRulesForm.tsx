import React from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LogOrRegAndRulesForm.scss"

const LogOrRegAndRulesForm = () => {
  const navigate = useNavigate();

  return (
    <div className={`LogOrRegAndRulesForm${localStorage.getItem("isDarkMode") ? "_dark" : ""} form`}>
      <div className="LogOrRegAndRulesForm button-container">
        <Button
          width="100%"
          onClick={() => navigate("/LoginOrRegister")}
        >
            Login Or Register
        </Button>
      </div>
      <div className="LogOrRegAndRulesForm img-form">
        <img src="rules.png" alt="Rule Icon" className="LogOrRegAndRulesForm img" />
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
