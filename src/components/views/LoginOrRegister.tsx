import React, { useState, useContext } from "react"; //added
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Context } from "../../context/Context"; //added


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
  const [username2, setUsername2] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);


  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username: username2, name, password });
      const response = await api.post("/users", requestBody);
      // Get the returned user and update a new object.

      const user = new User(response.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("friends", user.friends);
      sessionStorage.setItem("creation_date", user.creation_date);
      sessionStorage.setItem("isGuest", "false");
      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/LandingPage");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  const fetchAndSaveUserSettings = async (userId) => {
    try {
      const settingsResponse = await api.get(`/users/${userId}`);
      const userSettings = new User(settingsResponse.data);
      console.log("HOTKEYS::" + userSettings.hotkeyInputDraw);
      sessionStorage.setItem("hotkeyInputDraw", userSettings.hotkeyInputDraw);
      sessionStorage.setItem("hotkeyInputFill", userSettings.hotkeyInputFill);
      sessionStorage.setItem("hotkeyInputEraser", userSettings.hotkeyInputEraser);
      sessionStorage.setItem("hotkeyInputClear", userSettings.hotkeyInputClear);
    } catch (error) {
      handleError(error);
    }
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username: loginUsername, password: loginPassword });
      const response = await api.put("/users", requestBody);
      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("friends", user.friends);
      sessionStorage.setItem("birth_date", user.birth_date);
      sessionStorage.setItem("isGuest", "false");
      
      await fetchAndSaveUserSettings(user.id);

      
      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/LandingPage");
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
              value={username2}
              onChange={(un: string) => setUsername2(un)}
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
