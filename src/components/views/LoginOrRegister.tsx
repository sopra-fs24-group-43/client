import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = () => {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState<string>(null);
  const [loginPassword, setLoginPassword] = useState<string>(null);
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  


  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", username);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username: loginUsername, password: loginPassword });
      const response = await api.put("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", loginUsername);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <div className="login-column">
          <h2>Login</h2>
          <FormField
            label="Username"
            value={loginUsername}
            onChange={(un: string) => setLoginUsername(un)}
          />
          <FormField
            label="Password"
            value={loginPassword}
            onChange={(un: string) => setLoginPassword(un)}
          />
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          </div>
          <div className="login-column">
          <h2>Register</h2>
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Name"
            value={name}
            onChange={(n) => setName(n)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
