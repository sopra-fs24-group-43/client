import React from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LandingPage.scss"
// import BaseContainer from "components/ui/BaseContainer";
import Table from "../elements/Table";
import LogOrRegAndRulesForm from "components/elements/LogOrRegAndRulesForm";

const LandingPage = () => {
  const navigate = useNavigate();


  return (
    // <BaseContainer>
      <div className="LandingPage container">
        <LogOrRegAndRulesForm/>
        <Table/>
      </div>
    // </BaseContainer>
  );
};

export default LandingPage;
