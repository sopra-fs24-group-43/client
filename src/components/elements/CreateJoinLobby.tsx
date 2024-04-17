import React from "react";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import "styles/views/CreateJoinLobby.scss";

const CreateJoinLobby = () => {
  const navigate = useNavigate();

  return (
    <div className="CreateJoinLobby container">
      <div className="CreateJoinLobby button-container">
        <Button
          width="100%"
          onClick={() => navigate("/canvas")}
        >
          Create lobby
        </Button>
      </div>

      <div className="CreateJoinLobby button-container">
        <Button
          width="100%"
          onClick={() => navigate("/lobby")}
        >
          Join lobby
        </Button>
      </div>
    </div>
  );
};

export default CreateJoinLobby;
