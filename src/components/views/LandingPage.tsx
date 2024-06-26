import React, {useEffect} from "react";
import { Button } from "components/ui/Button";
import "styles/views/LandingPage.scss"
// import BaseContainer from "components/ui/BaseContainer";
import Table from "../elements/landingPage/Table";
import LogOrRegAndRulesForm from "../elements/landingPage/LogOrRegAndRulesForm";
import CreateJoinLobby from "../elements/landingPage/CreateJoinLobby";
import IsDarkMode from "./ClientSettings";

import StompApi from "../../helpers/StompApi";

export const stompApi = new StompApi();

const LandingPage = () => {
  // adding location to the session storage
  useEffect (() => {
    // adding location to the session storage
    sessionStorage.setItem("location", "landing");
  }, [])

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
