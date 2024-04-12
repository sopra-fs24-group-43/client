import React from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LandingPage.scss"
import BaseContainer from "components/ui/BaseContainer";

const LandingPage = () => {
  const navigate = useNavigate();
  // const rules = (
  //   <div>
  //     Freitags Maler is a free online multiplayer drawing and guessing pictionary game. 
  //     A normal game consists of a few rounds, where every round a player has to draw their chosen word and others have to guess it to gain points! 
  //     The person with the most points at the end of the game, will then be crowned as the winner!
  //     <br />
  //     <br />
  //     Have fun!
  //   </div>
  // );

  return (
    <BaseContainer>
      <div className="LandingPage container">
        <div className="LandingPage form">
          <div className="LandingPage button-container">
            <Button
              width="100%"
              onClick={() => navigate("/LoginOrRegister")}
            >
              Login Or Register
            </Button>
          </div>
          {/* <div className="game-rules">{rules}</div> */}
        </div>
      </div>
    </BaseContainer>
  );
};

export default LandingPage;
