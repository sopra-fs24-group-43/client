import React from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LandingPage.scss"
// import BaseContainer from "components/ui/BaseContainer";
import Table from "../elements/landingPage/Table";
import LogOrRegAndRulesForm from "../elements/landingPage/LogOrRegAndRulesForm";
import CreateJoinLobby from "../elements/landingPage/CreateJoinLobby";

const LandingPage = () => {
  const navigate = useNavigate();


  return (
    // <BaseContainer>
      <div className="LandingPage container">
        <LogOrRegAndRulesForm/>
        <Table/>
        <CreateJoinLobby/>
      </div>
    // </BaseContainer>
  );
};

export default LandingPage;
